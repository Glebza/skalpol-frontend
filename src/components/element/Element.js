import React, {Component} from 'react';
import ElementIcons from "../Util";
import "./Element.css"
import DataSourceDetails from '../element-details/datasource-detail'

class Element extends Component {

    state = {
        showModal: false,
    };
    onDragStart = (e) => {

        const {title, id,} = this.props.element;

        console.log(`element ${title} ${id} drag start `);
        const rect = e.target.getBoundingClientRect();
        e.dataTransfer.effectAllowed = 'move';
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        e.dataTransfer.setData("text/plain", JSON.stringify({title, id, offsetX, offsetY}));
        //onElementDragStart(e, {title: title, id: id, offsetX, offsetY});

    };

    onDoubleClick = (e) => {
        console.log('on double click');
        this.setState({showModal: true});
    };

    handleCloseButton = (details) => {

        this.setState({showModal: false});
        const {element, onElementDetailsChanged} = this.props;
        console.log(element.id);
        onElementDetailsChanged(element.id, details);

    }

    handleTitleChange = (e) => {
        const newTitle = e.target.innerText;
        const {id, onTitleChange} = this.props;
        if (onTitleChange) {
            onTitleChange(id, newTitle);
        }
    };

    onClick = (e) => {
        console.log(e.detail);

        switch (e.detail) {
            case 1: {
                this.props.onElementClick();
                break;
            }
            case 2: {
                this.onDoubleClick(e);
                break;
            }
            default: {
                break;
            }
        }

    }

    choseDetailWindow = (element) => {
        let elementWindow = null;
        const elementType = element.elementType;
        console.log(`el type =  ${elementType} and show = ${this.state.showModal}`);
        switch (elementType) {
            case "dataSource": {
                console.log('data source');
                elementWindow = (<DataSourceDetails onClose={this.handleCloseButton}
                                                    isOpen={this.state.showModal}
                                                    element={element}
                />);
                break;
            }
            case "filter": {
                break;
            }
            default: {
                break;
            }
        }
        return elementWindow;
    }


    render() {
        const {element} = this.props;
        const {title, position, elementType, isSelected} = element;
        const ElementIcon = ElementIcons[elementType];
        const modal = this.choseDetailWindow(element);

        return (
            <div
                draggable
                className={`element `}
                style={{position: 'absolute', left: position.x, top: position.y}}
                onDragStart={this.onDragStart}
                onDragOver={this.onDragOver}
                onClick={this.onClick}
            >
                {modal}
                <div className='element-content'>
                    <img className={`element-icon ${isSelected ? 'selected' : ''}`}
                         src={ElementIcon} alt={`${elementType} icon`}/>
                    <div
                        className="element-title"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={this.handleTitleChange}
                    >
                        {title}
                    </div>
                </div>
            </div>
        );
    }


}

export default Element;