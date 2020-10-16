import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildConrtols from '../../components/Burger/BuildControls/BuildControls';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            bacon: 0, 
            cheese: 0, 
            meat: 0
        }, 
        totalPrice: 4
    };

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1; // Add one to ingredient count
        
        // Always update state in immutable ways
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount;

        // Update prices
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];

        if (oldCount <= 0) {
            return; // Do nothing if there is zero ingredients or less
        }

        const updatedCount = oldCount - 1; // Reduce ingredient count by one
        
        // Always update state in immutable ways
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount;

        // Update prices
        const priceReduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceReduction;

        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    }

    render() {
        const disabledInfo = { ...this.state.ingredients}; 

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0 ? true : false;
        }

        return (
            <Aux>
                <Burger ingredients={this.state.ingredients} />
                <BuildConrtols 
                    ingredientAdded={this.addIngredientHandler} 
                    ingredientRemoved={this.removeIngredientHandler} 
                    disabled={disabledInfo}
                />
            </Aux>
        );
    }
}

export default BurgerBuilder;