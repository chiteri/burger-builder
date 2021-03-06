import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    state = {
        ingredients: null, 
        totalPrice: 4, 
        purchasable: false, 
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount() {
        axios.get('https://burger-builder-7196e.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
                // return response;
            })
            .catch(error => {
                this.setState({error: true});
            });
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);

        this.setState({purchasable: sum > 0});
    }

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
        this.updatePurchaseState(updatedIngredients);
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
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        // alert('You continue');
        this.setState({loading: true});

        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice, 
            customer: {
                name: 'Martin Chiteri', 
                address: {
                    street: '000 - 1111, 222 Ave NW',
                    zipCode: 'A1C B2D', 
                    country: 'CANADA'
                },
                email: 'Test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        // Send data to the backend
        axios.post('/orders.json', order)
            .then(response => { 
                this.setState({loading: false, purchasing: false}); 
            })
            .catch(error => { 
                this.setState({loading: false, purchasing: false});
            });
    }

    render() {
        const disabledInfo = { ...this.state.ingredients}; 

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0 ? true : false;
        }
        
        let orderSummary = null;

        if (this.state.loading) {
            orderSummary = <Spinner />;
        }

        let burger = this.state.error ? <p> Ingredients can't be loaded ...</p>: <Spinner />;
        
        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler} 
                        ingredientRemoved={this.removeIngredientHandler} 
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice}
                    />
                </Aux>
            );

            // set the order summary 
            orderSummary = 
                <OrderSummary 
                    ingredients={this.state.ingredients}
                    price={this.state.totalPrice.toFixed(2)}
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinue={this.purchaseContinueHandler}
                />;
        }

        if (this.state.loading) {
            orderSummary = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}> 
                 {orderSummary}    
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);