import React, {Component} from 'react';
import './App.css';
import Sidebar from '../sidebar';
import Header from '../header';
import ContentArea from "../content-area";
import {BrowserRouter as Router} from 'react-router-dom';


class App extends Component {

    state = {
        diagram: {
            diagramId: '',
            elements: [],
            connections: [],
            diagramAuthor: '',
            diagramTitle: 'Decision Chain diagram',
        },
        loading: true,
        error: false,
    };

    componentDidMount() {
        this.contentRef = React.createRef();
    }


    componentDidUpdate(prevProps, prevState, snapshot) {

        console.log(`state before update = ${JSON.stringify(prevState)}`);
        console.log(`state after update = ${JSON.stringify(this.state)}`);
    }


    onDiagramLoaded = (diagram) => {
        this.setState({diagram, loading: false})
    }

    onError = () => {
        this.setState({error: true, loading: false});
    }

    onElementDragStart = (e, params) => {
        const {title, id, offsetX, offsetY} = params;
        e.dataTransfer.setData("text/plain", JSON.stringify({title, id, offsetX, offsetY}));
    };

    onDragOver = (e) => {
        e.preventDefault();
    };


    onDrop = (e) => {
        e.preventDefault();
        const json = {...JSON.parse(e.dataTransfer.getData('text/plain'))};
        console.log({json})
        const title = json.title;
        const elementId = json.id;
        const offsetX = json.offsetX;
        const offsetY = json.offsetY;
        const xPos = e.clientX;
        const yPos = e.clientY;

        const idx = this.state.diagram.elements.findIndex((el) => {
            return el.id === elementId
        });

        const relativeX = xPos - offsetX;
        const relativeY = yPos - offsetY;

        if (idx !== -1) {
            const oldItem = this.state.diagram.elements[idx];
            console.log({...oldItem});

            this.setState(({diagram}) => {
                const {elements} = diagram;
                const newItem = {...oldItem, position: {x: relativeX, y: relativeY}};
                const newArray = [...elements.slice(0, idx), newItem, ...elements.slice(idx + 1)];
                const newDiagram = {...diagram, elements: newArray};
                return {diagram: newDiagram};

            });
        } else {
            this.setState(({diagram}) => {
                const {elements} = diagram;
                const newItem = {
                    id: elementId,
                    position: {x: relativeX, y: relativeY},
                    elementType: title,
                    title: title
                };
                const newArray = elements ? [...elements, newItem] : [newItem];
                const newDiagram = {...diagram, elements: newArray};
                return {diagram: newDiagram};
            });
        }
    };

    handleElementDetailsChange = (element_id, details) => {


        this.setState(({diagram}) => {
            const elements = diagram.elements;
            const idx = elements.findIndex(el => el.id === element_id);
            const oldItem = elements[idx];
            console.log({...details});
            const newItem = {...oldItem, details};
            const newElements = [...elements.slice(0, idx), newItem, ...elements.slice(idx + 1)]
            return {diagram: {...diagram, elements: newElements}};


        });
    }

    handleTitleChange = (id, newTitle) => {
        this.setState((prevState) => ({
            elements: prevState.diagram.elements.map((element) =>
                element.id === id ? {...element, title: newTitle} : element
            ),
        }));
    };

    onContentClick = () => {
        this.setState(({diagram}) => {
            const {elements} = diagram;
            const updatedElements = elements.map(element => {
                if (element.isSelected) {
                    return {...element, isSelected: false};
                } else {
                    return element;
                }
            });
            return {diagram: {...diagram, elements: updatedElements}};
        });
    }

    onElementClick = (id) => {
        this.setState(({diagram, drawingMode}) => {
            const {elements, connections} = diagram;
            const selectedElementIndex = elements.findIndex(el => el.isSelected);
            const clickedElementIndex = elements.findIndex(el => el.id === id);

            if (!drawingMode && selectedElementIndex === -1) {
                // No element is currently selected and we're not in drawing mode
                // Select the clicked element and enter drawing mode
                const newElements = this.toggleProperty(elements, id, 'isSelected');
                return {
                    diagram: {...diagram, elements: newElements},
                    drawingMode: true
                };
            } else if (drawingMode && selectedElementIndex !== -1 && clickedElementIndex !== selectedElementIndex) {
                // An element is selected, we're in drawing mode, and a different element was clicked
                // Create a new connection and exit drawing mode
                let newConnections;
                if (connections) {
                    newConnections = [...connections, {source: elements[selectedElementIndex].id, target: id}];
                } else {
                    newConnections = [{source: elements[selectedElementIndex].id, target: id}];
                }

                const newElements = this.toggleProperty(elements, id, 'isSelected');
                return {
                    diagram: {...diagram, connections: newConnections, elements: newElements},
                    drawingMode: false
                };
            } else {
                // Either the same element was clicked, or we're not in drawing mode and an element is selected
                // Deselect the clicked element and stay in the current mode
                const newElements = this.toggleProperty(elements, id, 'isSelected');
                return {
                    diagram: {...diagram, elements: newElements},
                    drawingMode: drawingMode
                };
            }
        });
    };

    toggleProperty(array, id, field) {
        const idx = array.findIndex(el => el.id === id);
        const oldItem = array[idx];
        const newItem = {...oldItem, [field]: !oldItem[field]};
        return [...array.slice(0, idx), newItem, ...array.slice(idx + 1)];
    }

    render() {
        const {diagram, loading, error} = this.state;
        return (
            <Router>
                <div className="container">
                    <Header/>
                    <Sidebar/>
                    <ContentArea
                        handleTitleChange={this.handleTitleChange}
                        onDragOver={this.onDragOver}
                        onElementClick={this.onElementClick}
                        onContentClick={this.onContentClick}
                        onDrop={this.onDrop}
                        onElementDragStart={this.onElementDragStart}
                        onDiagramLoaded={this.onDiagramLoaded}
                        onElementDetailsChanged={this.handleElementDetailsChange}
                        onError={this.onError}
                        diagram={diagram}
                        loading={loading}
                        error={error}
                        contentRef={this.contentRef}

                    />
                </div>
            </Router>

        );
    }
}

export default App;