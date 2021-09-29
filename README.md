# PokeSPA
Application for Quick Frontend Developer position

This is the homepage for the app

![Alt text](docs/home.png?raw=true "Home")

And the details page

![Alt text](docs/details.png?raw=true "Home")

## Responsive

Some fixes are pending in order to make the app completely responsive.

 ![Alt text](docs/responsive-1.png?raw=true "First Mobile Screenshot")

 ![Alt text](docs/responsive-2.png?raw=true "Second Mobile Screenshot")

 ## Routing

 `react-router-dom` was used to handle routing. Accessing `/details/:id/` makes the details component available. Implementation of 404 status page is pending for invalid ids. Page title is changed on mount and dismount of details component to keep a correct name for history.

 ## State management

 `react-redux` was the library of choice for state management. It handles loading status, list of pokemon, filters, and search.

 ## Animations

 Animations are present when clicking a type filter, and in the loading screen during pokemon filtering. One animation was reused for the 'No Results' screen.

## Caching

`localStorage` is used to save the pokemon list. Console tells when the data is cached instead of requested after reloading.

## Deploy

The page is available [here](https://juanod.github.io/PokeSPA/)
