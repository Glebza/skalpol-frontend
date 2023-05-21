import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, FormGroup, Label, Input, Table} from 'reactstrap';

class DataSourceDetails extends React.Component {

    state = {
        tables: [
            {
                name: 'Clients',
                fields: [{title: "id", type: 'int'}, {title: "name", type: 'string'}, {
                    title: "surname",
                    type: 'string'
                }]
            },
            {
                name: 'Services',
                fields: [{title: "id", type: 'int'}, {title: "title", type: 'string'}, {title: "price", type: 'int'}]
            },
            {
                name: 'ClientsServices',
                fields: [{title: "id", type: 'int'}, {title: "client_id", type: 'int'}, {
                    title: "service_id",
                    type: 'int'
                }, {title: "date", type: 'date'}]
            }
        ],
        joinTypes: ['inner', 'left', 'right'],
        dataConnections: [],
        currentConnection: ''
    }

    closeModalAndSave = (onClose, dataConnections) => {
        onClose(dataConnections);
    }
    handleSelectChange = (e, field) => {
        this.setState({
            currentConnection: {
                ...this.state.currentConnection,
                [field]: e.target.value,
            },
        });
    };

    handleAddConnection = () => {
        this.setState({
            dataConnections: [...this.state.dataConnections, this.state.currentConnection],
            currentConnection: {
                tableFrom: '',
                tableTo: '',
                joinType: 'inner',
                fieldFrom: '',
                fieldTo: '',

            },
        });
    };


    render() {
        const {isOpen, element, onClose} = this.props;
        const {tables, joinTypes, dataConnections, currentConnection} = this.state;

        return (
            <Modal isOpen={isOpen} toggle={() => this.closeModalAndSave(onClose, dataConnections)} size="xl">
                <ModalHeader toggle={() => this.closeModalAndSave(onClose, dataConnections)}>
                    Configure {element.title}
                </ModalHeader>
                <ModalBody>
                    <Table>
                        <thead>
                        <tr>
                            <th>Table</th>
                            <th></th>
                            <th>Table</th>
                            <th>on</th>
                            <th>Column</th>
                            <th>Column</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dataConnections.map((con) => {
                            return (<tr>
                                <td>
                                    {con.tableFrom}
                                </td>
                                <td>
                                    {con.joinType} join
                                </td>
                                <td>
                                    {con.tableTo}
                                </td>
                                <td>
                                    on
                                </td>
                                <td>
                                    {con.fieldFrom}
                                </td>
                                <td>
                                    {con.fieldTo}
                                </td>
                            </tr>)
                        })}
                        <tr>
                            <td>
                                <Input
                                    type="select"
                                    name="tableFrom"
                                    id="tableFrom"
                                    value={currentConnection.tableFrom}
                                    onChange={(e) => this.handleSelectChange(e, 'tableFrom')}
                                >
                                    <option value="">Select a table</option>
                                    {tables.map((table) => (
                                        <option key={table.name} value={table.name}>
                                            {table.name}
                                        </option>
                                    ))}
                                </Input>
                            </td>
                            <td>
                                <FormGroup>
                                    <Input
                                        type="select"
                                        name="joinType"
                                        id="joinType"
                                        value={currentConnection.joinType}
                                        onChange={(e) => this.handleSelectChange(e, 'joinType')}
                                    >
                                        {joinTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </Input>
                                    <Label for="joinType">Join</Label>
                                </FormGroup>
                            </td>
                            <td>
                                <Input
                                    type="select"
                                    name="tableTo"
                                    id="tableTo"
                                    value={currentConnection.tableTo}
                                    onChange={(e) => this.handleSelectChange(e, 'tableTo')}
                                >
                                    <option value="">Select a table</option>
                                    {tables.map((table) => (
                                        <option key={table.name} value={table.name}>
                                            {table.name}
                                        </option>
                                    ))}
                                </Input>
                            </td>
                            <td>
                                on
                            </td>
                            <td>
                                <Input
                                    type="select"
                                    name="fieldFrom"
                                    id="fieldFrom"
                                    value={currentConnection.fieldFrom}
                                    onChange={(e) => this.handleSelectChange(e, 'fieldFrom')}
                                >
                                    <option value="">Select a field</option>
                                    {currentConnection.tableFrom? tables.find(el => el.name === currentConnection.tableFrom).fields.map((field) => (
                                        <option key={currentConnection.tableFrom + "-" + field.title} value={field.title}>
                                            {field.title}
                                        </option>
                                    )):null}
                                </Input>
                            </td>
                            <td>
                                <Input
                                    type="select"
                                    name="fieldTo"
                                    id="fieldTo"
                                    value={currentConnection.fieldTo}
                                    onChange={(e) => this.handleSelectChange(e, 'fieldTo')}
                                >
                                    <option value="">Select a field</option>
                                    {currentConnection.tableTo? tables.find(el => el.name === currentConnection.tableTo).fields.map((field) => (
                                        <option key={currentConnection.tableTo + "-" + field.title} value={field.title}>
                                            {field.title}
                                        </option>
                                    )):null}
                                </Input>
                            </td>
                        </tr>


                        </tbody>
                    </Table>
                    <Row form>
                        <Col md={12}>
                            <Button color="primary" onClick={this.handleAddConnection}>
                                Add Connection
                            </Button>
                        </Col>
                    </Row>
                    <hr/>
                    <h5>Current Connections</h5>
                    <ul>
                        {dataConnections.map((connection, index) => (
                            <li key={index}>
                                {connection.tableFrom} ({connection.joinType} join) {connection.tableTo} on {connection.fieldFrom}  {connection.fieldTo}
                            </li>
                        ))}
                    </ul>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => this.closeModalAndSave(onClose, dataConnections)}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default DataSourceDetails;