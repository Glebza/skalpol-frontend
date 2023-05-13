import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // replace this with the id of your app root element

class DataSourceDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tables: [],
            joinType: '',
            table1Field: '',
            table2Field: '',
            joins: [],
        };
    }


    closeModalAndSave = () => {
        this.props.onClose(this.state);
    }

    handleAddJoin = () => {
        this.setState(prevState => ({
            joins: prevState.joins.concat({
                joinType: prevState.joinType,
                table1Field: prevState.table1Field,
                table2Field: prevState.table2Field,
            }),
            joinType: '',
            table1Field: '',
            table2Field: '',
        }));
    }

    render() {

        const {showModal} = this.props;

        return (
                <Modal
                    isOpen={showModal}
                    onRequestClose={this.closeModalAndSave}
                    contentLabel="Data Source Modal"
                >
                    <h2>Configure Data Source</h2>
                    {/* Your form fields go here */}
                    <button onClick={this.closeModalAndSave}>Close</button>
                </Modal>
        );
    }
}

export default DataSourceDetails;