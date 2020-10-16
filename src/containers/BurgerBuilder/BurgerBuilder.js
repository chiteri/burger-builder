import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildConrtols from '../../components/Burger/BuildControls/BuildControls';

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            bacon: 0, 
            cheese: 0, 
            meat: 0
        }
    };

    render() {
        return (
            <Aux>
                <Burger ingredients={this.state.ingredients} />
                <BuildConrtols />
            </Aux>
        );
    }
}

export default BurgerBuilder;