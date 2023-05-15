import React, {Component} from "react";
import Element from "../element";
import './ContentArea.css'
import Spinner from "../spinner";
import ErrorIndicator from "../error-indicator";
import DiagramService from "../services";
import * as d3 from 'd3';

export default class ContentArea extends Component {

    diagramService = new DiagramService();

    componentDidMount() {
        this.getDiagram(1);
    }

    getDiagram = (id) => {
        this.diagramService.getDiagram(id).then(this.props.onDiagramLoaded).catch(this.props.onError);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('Content area did update');
        const {contentRef, diagram} = this.props;
        // Remove the previous connection lines if they exist
        d3.select(contentRef.current).select('svg.connections').remove();
        // Draw the new connection lines
        this.drawConnectionLine( contentRef,diagram.elements, diagram.connections);
    }

    drawConnectionLine = (contentRef,elements, connections) => {
        // Set up a d3 container for the connection lines
        const svg = d3.select(contentRef.current)
            .append('svg')
            .attr('width', contentRef.current.clientWidth)
            .attr('height', contentRef.current.clientHeight)
            .attr('class', 'connections');

        if (connections) {
            connections.forEach((connection) => {
                console.log(connection);
                const source = this.extractElementById(elements, connection.source);
                const target = this.extractElementById(elements, connection.target);
                svg.append('line')
                    .attr('x1', source.position.x + 23)
                    .attr('y1', source.position.y + 45)
                    .attr('x2', target.position.x + 23)
                    .attr('y2', target.position.y)
                    .attr('stroke', '#17A2B8')
                    .attr('stroke-width', 2);


            });
        }

    };

    extractElementById(elements, id) {
        const sourceIdx = elements.findIndex((el) => {
            return el.id === id
        });
        return elements[sourceIdx];
    }

    onContentClick = (e) => {
        // if the click event is directly on the content, not on a child element
        if (e.target === e.currentTarget) {
            this.props.onContentClick(); // call the provided callback
        }
    }


    render() {
        const {
            diagram, loading, error, contentRef,
            handleTitleChange, onDragOver, onElementClick, onElementDetailsChanged,
            onDrop, onElementDrop, onElementDragStart,
        } = this.props;

        const hasData = !(loading || error);
        const errorMessage = error ? <ErrorIndicator/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = hasData ? <DiagramView diagram={diagram}
                                               handleTitleChange={handleTitleChange}
                                               onDragOver={onDragOver}
                                               onElementClick={onElementClick}
                                               onElementDrop={onElementDrop}
                                               onElementDragStart={onElementDragStart}
                                               onElementDetailsChanged={onElementDetailsChanged}/> : null;

        return (
            <div className="content-area">
                <div
                    className="content"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onClick={this.onContentClick}
                    ref={contentRef}
                >
                    {errorMessage}
                    {spinner}
                    {content}
                </div>
            </div>
        );
    }
}


const DiagramView = ({
                         diagram,
                         onElementDragStart,
                         onElementClick,
                         onElementDetailsChanged,
                         onDragOver,
                         handleTitleChange
                     }) => {
    const {elements, diagramTitle} = diagram;

    return (<React.Fragment>
        <h3>{diagramTitle}</h3>
        {elements.map((element) => (
            <Element
                element={element}
                onElementDragStart={onElementDragStart}
                onElementClick={() => onElementClick(element.id)}
                onDragOver={onDragOver}
                onTitleChange={handleTitleChange}
                onElementDetailsChanged={onElementDetailsChanged}
            />))
        }
    </React.Fragment>)
}


