<p align="center">
<img src="https://graphql.org/img/og-image.png" width=500px height=200px>
<h1 align="center">GraphQL </h1>

### About :

This documentation will cover the basics of GraphQL API's. It will include why and when to use GraphQL API's. In this documentation we will cover GraphQL examples with Node.js and Express.

## What is GraphQL ?
GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. It has many advantages over REST API's while used with large scale applications. It allows the developer to get exactly the data they want without overfetching or underfetching.

## GraphQL vs REST Structure
Below you can see the difference between REST and GraphQL API Structures. It's important to understand how REST works to see the benefits of GraphQL. As it is seen GraphQL can only perform POST requests and to update data it uses mutations.

GraphQL:
![image](https://user-images.githubusercontent.com/59853931/136580875-1b7f32c7-0040-4537-b82f-20e5d0edefd6.png)


REST:
![image](https://user-images.githubusercontent.com/59853931/136580907-89fba15c-5a8a-4c14-846b-ab51f07b46c5.png)


## GraphQL Elements
GraphQL has some different keywords then REST. These are:
	- Schema
	- TypeDefs
	- Queries
	- Muations

### Sample JSON Data
This JSON file is going to be act as a database.
```jsx
[
{"id":1,"pizza_name":"Cheese Pizza", "price": "10$", "ingredients":["Mushrooms","Olives","Extra Cheese"]},
{"id":2,"pizza_name":"Pepperoni Pizza", "price": "12$", "ingredients":["Pepperoni","Mushrooms","Olives"]},
{"id":3,"pizza_name":"Veggie Pizza", "price": "15$", "ingredients":["Mushrooms","Olives","Green Peppers","Onions","Extra Cheese"]},
{"id":4,"pizza_name":"Meat Pizza", "price": "20$", "ingredients":["Pepperoni","Mushrooms","Olives","Sausage","Black Olives","Green Peppers","Onions","Extra Cheese"]},
{"id":5,"pizza_name":"Margherita Pizza", "price": "10$", "ingredients":["Olives","Sausage","Black Olives"]},
{"id":6,"pizza_name":"BBQ Chicken Pizza", "price": "18$", "ingredients":["Chicken","Mushrooms","Olives","Sausage","Black Olives","Green Peppers","Onions","Extra Cheese"]},
{"id":7,"pizza_name":"Hawaiian Pizza", "price": "16$", "ingredients":["Mushrooms","Olives","Sausage","Black Olives","Green Peppers","Onions","Extra Cheese"]}
]
```
### Schema
Schema is the place where the queries and mutations are stored. Both the front-end and back-end team can look at the schema and understand the API.

You can see an example schema down below with express and GraphQL. 
```jsx
const Query = new  GraphQLObjectType({...});
const Mutation = new  GraphQLObjectType({...});

//Schema
const schema = new  GraphQLSchema({
	query:  Query,
	mutation:  Mutation,
});

app.use('/graphql',  graphqlHTTP({
	schema,
	graphiql:  true
}));
```
The graphiql boolean allows us to open a in browser API testing app.

### Type Defs
Every graph uses a **schema** to define the types of data it includes.  You can think of them just like type definitions from Java like **int**, **string**, **float** etc.
```jsx
const  PizzaType = new  GraphQLObjectType({
	name:  'Pizza',
	fields:  {
		id:  {type:  GraphQLInt},
		pizza_name:  {type:  GraphQLString},
		price:  {type:  GraphQLString},
		ingredients:  {type:  GraphQLList(GraphQLString)},
	}
});
```

### Queries
Queries allows us to get data from our API. 
```jsx
const  Query = new  GraphQLObjectType({
	name:  'Query',
	fields:  {
		getAll:  {
			type:  new  GraphQLList(PizzaType),
			resolve(parent, args)  {
				return  pizzaDB;
			}
		}
	}
});
```

The great thing about queries is that it allows us to get any data we want. If we want all the data but not the **id** we can do that with just one request in  GraphQL and there won't be any unused data so it's going to prevent overfetching.
```jsx
query {
	getAll {
		pizza_name
		price
		ingredients
	}
}
```
### Mutations
Mutations allows us to mutate our data. We can use mutations to update, delete and etc. inside our API. In the below example we create a mutation to add a new pizza to our pizza JSON database.
```jsx
const  Mutation = new  GraphQLObjectType({
	name:  'Mutation',
	fields:  {
		createNewPizza:  {
			type:  PizzaType,
			args:  {
				pizza_name:  {type:  GraphQLString},
				price:  {type:  GraphQLString},
				ingredients:  {type:  GraphQLList(GraphQLString)}
			},
			resolve(parent, args)  {
				pizzaDB.push({
					id:  pizzaDB.length  +  1,
					pizza_name:  args.pizza_name,
					price:  args.price,
					ingredients:  args.ingredients
				});
				
				return  args;
			}
		}
	}
});
```

At below we execute our mutation like this. We don't need to specify the ID since it automatically increases its id to the size of the JSON data. This prevents human error factor. The fallowing query inside of the **createNewPizza** will display the new items that got added.
```jsx
mutation {
	createNewPizza(pizza_name: "New Pizza", price: "0$", ingredients: ["tomato", "pepper", "cheese"]) {
		id
		pizza_name
		price
		infredients
	}
}
```
