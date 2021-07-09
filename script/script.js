'use strict';

const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.nav');
const moviesList = menu.querySelector('.movies-list');
const heroList = document.querySelector('main');

const heroSet = new Set();
const movieSet = new Set();
let moviesLi = [];

class Hero{
  constructor({	
    name,
    species,
    gender,
    birthDay,
    deathDay,
    status,
    actors,
    photo,
    movies,
    realName,
    citizenship
  }){
    this.name = name;
    this.species = species;
    this.gender = gender;
    this.birthDay = birthDay;
    this.deathDay = deathDay;
    this.status = status;
    this.actors = actors;
    this.photo = photo;
    this.movies = movies;
    this.realName = realName;
    this.citizenship = citizenship;
    this.card = '';
  }

  createCard() {
    this.card = document.createElement('div');
    this.card.className = 'hero';
    const getMovies = () => {
      let text = [];
      if (this.movies) {
        this.movies.forEach(item => {
          text.push(`<span class="hero-movie">${item}</span>`);
        });
      }
      return text;
    };
    this.card.insertAdjacentHTML('afterbegin', `
      <img src="${this.photo}" alt="${this.name}" class="hero__image">
      <h2 class="name"><strong>name: </strong>${this.name}</h2>
      <div class="hero__text">
        ${this.species ? '<p class="species"><strong>species: </strong>' + this.species  + '</p>' : ''}
        ${this.gender ? '<p class="gender"><strong>gender: </strong>' + this.gender + '</p>' : ''}
        ${this.birthDay ? '<p class="birthDay"><strong>birthDay: </strong>' + this.birthDay + '</p>' : ''}
        ${this.deathDay ? '<p class="deathDay"><strong>deathDay: </strong>' + this.deathDay + '</p>' : ''}
        ${this.status ? '<p class="status"><strong>status: </strong>' + this.status + '</p>' : ''}
        ${this.actors ? '<p class="actors"><strong>actors: </strong>' + this.actors + '</p>' : ''}
        ${this.movies ? '<p class="movies"><strong>movies: </strong>' + getMovies().join(', ') + '</p>' : ''}
        ${this.realName ? '<p class="realName"><strong>real Name: </strong>' + this.realName + '</p>' : ''}
        ${this.citizenship ? '<p class="citizenship"><strong>citizenship: </strong>' + this.citizenship + '</p>' : ''}
      </div>
    `);
  }

  getCard() {
    return this.card;
  }

  getMovies(movie) {
    return this.movies.find(item => item === movie) !== -1 ? true : false;
  }
};

Hero.getNew = ({
  name,
  species,
  gender,
  birthDay,
  deathDay,
  status,
  actors,
  photo,
  movies,
  realName,
  citizenship
}) => {
  const hero = new Hero({	
    name,
    species,
    gender,
    birthDay,
    deathDay,
    status,
    actors,
    photo,
    movies,
    realName,
    citizenship
  });
  hero.createCard();
  return hero;
};

const start = () => {
  fetch('./dbHeroes.json')
  .then(response => {
    if (response.status !== 200) {
      throw new Error('Network status not 200');
    }
    return response.json();
  })
  .then(response => {
    response.forEach(data => {
      const hero = Hero.getNew(data);
      heroSet.add(hero);
      if (hero.movies) hero.movies.forEach(movie => movieSet.add(movie));
    });
    getMovies();
    getHeroes();
  })
  .catch(error => console.error(error));
};

const getMovies = () => {
  movieSet.forEach(movie => {
    moviesList.insertAdjacentHTML('beforeend', `
      <li class="nav-movies">${movie}</li>
    `);
  });
  moviesLi = moviesList.querySelectorAll('li');
};

const getHeroes = () => {
  const getHeroesOfMovie = (movie) => {
    console.log(movie);
    heroList.textContent = '';
    heroSet.forEach(hero => {
      if (movie.toLowerCase() === 'all movies') {
        heroList.appendChild(hero.getCard());
      } else if (hero.movies) {
        console.log(hero.movies);
        let isMovie = false;
        hero.movies.forEach(item => {
          if (item.toLowerCase() === movie.toLowerCase()) {
            isMovie = true;
          }
          if (isMovie) heroList.appendChild(hero.getCard());
        });
      }
    });
  };

  const getHeroes = (movie) => {
    heroList.scrollTo({top: 0, behavior: 'smooth'});
    moviesLi.forEach(elem => {
      elem.classList.remove('nav-movies_active');
      if (elem.textContent.toLowerCase() === movie.toLowerCase()) elem.classList.add('nav-movies_active');
    });
    menu.classList.remove('nav_active');
    menuButton.classList.remove('menu-button_active');
    getHeroesOfMovie(movie);
  };
  
  getHeroesOfMovie('all movies');
  
  document.addEventListener('click', event => {
    if (event.target.closest('.nav-movies')) {

      getHeroes(event.target.closest('.nav-movies').textContent);

    } else if (event.target.closest('.hero-movie')) {

      getHeroes(event.target.closest('.hero-movie').textContent);

    } else if (event.target.closest('.menu-button')) {

      menu.classList.toggle('nav_active');
      menuButton.classList.toggle('menu-button_active');

    }
  });
};

start();
