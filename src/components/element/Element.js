import React, {Component} from 'react';
import ElementIcons from "../Util";
import "./Element.css"
import DataSourceDetails from '../element-details/datasource-detail'

class Element extends Component {

    state = {
        showModal: false,
    };
    onDragStart = (e) => {
        const {title, id} = this.props;
        const rect = e.target.getBoundingClientRect();

        e.dataTransfer.setData('text/plain', JSON.stringify({title, id}));
        e.dataTransfer.effectAllowed = 'move';
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        if (offsetY < 10 && offsetX < 10) {
            this.props.onConnectDragStart(e, {id: this.props.id, offsetX, offsetY});
        } else {
            this.props.onElementDragStart(e, {title: this.props.title, id: this.props.id, offsetX, offsetY});
        }

    };

    onDoubleClick = (e) => {
        console.log('on double click');
        this.setState({showModal: true});
    };

    handleCloseButton = (details) => {
        this.setState({showModal: false});
        const {id} = this.props;
        this.props.onElementDetailsChanged(id, details);

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
                console.log('single click');
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


    render() {
        const {title, position, elementType, isSelected,} = this.props;
        const {showModal} = this.state;
        const ElementIcon = ElementIcons[elementType];


        const modal = showModal ? <DataSourceDetails onClose={this.handleCloseButton}
                                                     isOpen={showModal}/> : null;

        return (
            <div
                draggable
                className={`element `}
                style={{position: 'absolute', left: position.x, top: position.y}}
                onDragStart={this.onDragStart}
                onDragOver={this.onDragOver}
                onClick={this.onClick}
            >
                <DataSourceDetails onClose={this.handleCloseButton}
                                   showModal={showModal}/>
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