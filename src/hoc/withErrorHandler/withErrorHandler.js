import React, {Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

const withErrorHandler = (WrappedComponent, axios) => {
    // Return an annonymous class
    return  class extends Component {
        state = {
            error: null
        }

        // Set up your global interceptors 
        componentDidMount() {
            // 
            axios.interceptors.request.use(req => {
                // Whenever you make a request, no error is set up
                this.setState({error: null});
                return req;
            });

            // Set up the error function 
            axios.interceptors.response.use(res => res, error => {
                this.setState({error: error});
            });
        }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        }

        render() {
            return (
                <Aux> 
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null} 
                    </Modal>
                    <WrappedComponent {...this.props} /> 
                </Aux>
            );
        }
    }
};

export default withErrorHandler;