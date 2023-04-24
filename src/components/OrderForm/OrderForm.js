import React, { Component } from 'react';

class OrderForm extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      ingredients: []
    };
  }

  handleNameChange = e => {
    e.preventDefault();
    this.setState({ name: e.target.value });
  }

  handleIngredientChange = e => {
    e.preventDefault();
    const ingredient = e.target.name;
    this.setState(prevState => ({
      ingredients: [...prevState.ingredients, ingredient]
    }))
  }

  handleSubmit = e => {
    e.preventDefault();
    const { name, ingredients } = this.state;
    if (name && ingredients.length) {
      fetch('http://localhost:3001/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({ name, ingredients })
      })
      .then(response => response.json())
      .then(data => {
        this.props.addOrder(data);
        this.clearInputs();
      })
      .catch(err => console.log(`Error:`, err));
    }
  }

  clearInputs = () => {
    this.setState({name: '', ingredients: []});
  }

  render() {
    const possibleIngredients = ['beans', 'steak', 'carnitas', 'sofritas', 'lettuce', 'queso fresco', 'pico de gallo', 'hot sauce', 'guacamole', 'jalapenos', 'cilantro', 'sour cream'];
    const ingredientButtons = possibleIngredients.map(ingredient => {
      return (
        <button key={ingredient} name={ingredient} onClick={e => this.handleIngredientChange(e)}>
          {ingredient}
        </button>
      )
    });

    return (
      <form>
        <input
          type='text'
          placeholder='Name'
          name='name'
          value={this.state.name}
          onChange={e => this.handleNameChange(e)}
        />

        { ingredientButtons }

        <p>Order: { this.state.ingredients.join(', ') || 'Nothing selected' }</p>

        <button onClick={e => this.handleSubmit(e)}>
          Submit Order
        </button>
      </form>
    )
  }
}

export default OrderForm;
