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
        componentWillMount() {
            // Create a state property on the fly, for request
            this.reqInterceptor = axios.interceptors.request.use(req => {
                // Whenever you make a request, no error is set up
                this.setState({error: null});
                return req;
            });

            // Set up the error function 
            // Create a state property on the fly, for response
            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error});
            });
        }

        // Remove your global / old interceptors 
        // This is a lifecycle hook executed when a component is not required
        componentWillUnmount() {
            // Remove our interceptors while preventing memory leaks
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
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