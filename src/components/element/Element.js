import React, {Component} from 'react';
import ElementIcons from "../Util";
import "./Element.css"

class Element extends Component {
    onDragStart = (e) => {
        const {title, id} = this.props;
        const rect = e.target.getBoundingClientRect();

        e.dataTransfer.setData('text/plain', JSON.stringify({title, id}));
        e.dataTransfer.effectAllowed = 'move';
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        if (offsetY < 10 && offsetX < 10){
            this.props.onConnectDragStart(e,{id: this.props.id,offsetX, offsetY});
        }else{
            this.props.onElementDragStart(e, {title: this.props.title, id: this.props.id, offsetX, offsetY});
        }

    };

    handleTitleChange = (e) => {
        const newTitle = e.target.innerText;
        const {id, onTitleChange} = this.props;
        if (onTitleChange) {
            onTitleChange(id, newTitle);
        }
    };

    handleDoubleClick = (e) => {
        e.stopPropagation();
        const {id, onElementDoubleClick} = this.props;
        if (onElementDoubleClick) {
            onElementDoubleClick(id)
        }
    }


    render() {
        const {title, position, elementType, isSelected, onElementClick} = this.props;
        const ElementIcon = ElementIcons[elementType];

        return (
            <div
                draggable
                className={`element `}
                style={{position: 'absolute', left: position.x, top: position.y}}
                onDragStart={this.onDragStart}
                onDragOver={this.onDragOver}
                onDoubleClick={this.handleDoubleClick}
                onClick={onElementClick}
            >
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