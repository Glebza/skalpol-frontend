import React, {Component} from 'react';
import './Sidebar.css';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dragging: false,
            dragElementType: '',
        };
    }

    sbElements = [{'elementType': 'getData', 'title': 'Source'},
        {'elementType': 'filterData', 'title': 'Filter'},
        {'elementType': 'start', 'title': 'Start'},
        {'elementType':'ifCondition','title': 'If'}];

    onDragStart = (e, elementType) => {
        console.log(`onDragStartSB`);
        const id = Date.now();
        const rect = e.target.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        e.dataTransfer.setData('text/plain',
            `{
            "title":"${elementType}",
            "id":${id},
            "elementType":"${elementType}",
            "offsetX":"${offsetX}",
            "offsetY":"${offsetY}"
            }`);
        this.setState({dragging: true, dragElementType: elementType, id: id});
    };

    onDragEnd = () => {
        console.log(`onDragEndSB`)
        this.setState({dragging: false, dragElementType: ''});
    };

    render() {
        return (
            <div className="sidebar">
                <h3>Elements</h3>
                <div className="element-list">
                    {

                        this.sbElements.map((el) => {
                            return (<button
                                className='btn btn-info'
                                type='button'
                                draggable
                                onDragStart={(e) => this.onDragStart(e, el.elementType)}
                                onDragEnd={this.onDragEnd}
                            >
                                {el.title}
                            </button>)
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Sidebar;