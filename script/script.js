'use strict';

const preloader = document.querySelector('.preloader');
const logo = document.querySelector('.logo');
logo.classList.add('logo_active');
preloader.classList.add('preloader_active');

const audio = document.querySelector('audio');
const soundBtnImg = document.querySelector('.sound img');

const nav = document.querySelector('.nav');
const heroList = document.querySelector('main');

const heroSet = new Set();
const moviesSet = new Set();
const speciesSet = new Set();
const genderSet = new Set();
const statusSet = new Set();
const citizenshipSet = new Set();

const moviesSelect = document.getElementById('movies');
const speciesSelect = document.getElementById('species');
const genderSelect = document.getElementById('gender');
const statusSelect = document.getElementById('status');
const citizenshipSelect = document.getElementById('citizenship');

class Slider {
  constructor({
    wrapper,
    slide,
    prev,
    next,
  }) {
    this.wrapper = document.querySelector(wrapper);
    this.slide = slide;
    this.slides = [];
    this.prev  = document.querySelector(prev);
    this.next  = document.querySelector(next);
    this.margin = 10;
    this.step = 0;
    this.position = 0;
  }

  init() {
    this.prev.addEventListener('click', this.prevSlide.bind(this));
    this.next.addEventListener('click', this.nextSlide.bind(this));
  }

  update() {
    this.position = 0;
    this.slides = [...this.wrapper.querySelectorAll(this.slide)];
    if (this.slides.length > 3) {
      this.margin = (this.wrapper.parentNode.offsetWidth - (this.slides[0].offsetWidth * 3)) / 2;
      for (let i = 0; i < this.slides.length - 1; i++) {
        this.slides[i].style.marginRight = this.margin + 'px';
      }
      this.step = this.slides[0].offsetWidth + this.margin;
    }
    this.wrapper.style.transform = 'translateX(0)';
  }

  prevSlide() {
    if (this.position > 0) {
      this.position--;
      this.wrapper.style.transform = `translateX(${-(this.position * this.step)}px)`;
    }
  }

  nextSlide() {
    if (this.slides.length - this.position > 3) {
      this.position++;
      this.wrapper.style.transform = `translateX(${-(this.position * this.step)}px)`;
    }
  }
}

Slider.create = ({
  wrapper,
  slide,
  prev,
  next,
}) => {
  const slider = new Slider({
    wrapper,
    slide,
    prev,
    next,
  });
  slider.init();
  return slider;
};

class Hero {
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
  }) {
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
      const text = [];
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
    return this.movies.find(item => item === movie) !== -1;
  }
}

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

const getSelects = () => {
  const createOptions = (set, select) => {
    set.forEach(item => {
      select.insertAdjacentHTML('beforeend', `<option value="${item.toUpperCase()}">${item.toUpperCase()}</option>`);
    });
  };

  createOptions(moviesSet, moviesSelect);
  createOptions(speciesSet, speciesSelect);
  createOptions(genderSet, genderSelect);
  createOptions(statusSet, statusSelect);
  createOptions(citizenshipSet, citizenshipSelect);
};

const getHeroes = slider => {

  const isMovie = (hero, movieTitle) => {
    if (!movieTitle) return true;
    let isMovie = false;
    if (hero.movies) hero.movies.forEach(movie => {
      if (movie.toUpperCase() === movieTitle) isMovie = true;
    });
    return isMovie;
  };

  const isQuality  = (hero, quality, value) => !value || hero[quality] && hero[quality].toUpperCase() === value || !hero[quality] && value === 'NO DATA';

  const getHeroes = ({
    movie,
    species,
    gender,
    status,
    citizenship
  }) => {
    heroList.textContent = '';
    heroSet.forEach(hero => {
      if (isQuality(hero, 'species', species) &&
      isQuality(hero, 'gender', gender) &&
      isQuality(hero, 'status', status) &&
      isQuality(hero, 'citizenship', citizenship) &&
      isMovie(hero, movie)) {
        heroList.append(hero.getCard());
      }
    });
    slider.update();
  };

  getHeroes({});

  nav.addEventListener('change', () => {
    getHeroes({
      movie: moviesSelect.value !== 'ALL' ? moviesSelect.value : '',
      species: speciesSelect.value !== 'ALL' ? speciesSelect.value : '',
      gender: genderSelect.value !== 'ALL' ? genderSelect.value : '',
      status: statusSelect.value !== 'ALL' ? statusSelect.value : '',
      citizenship: citizenshipSelect.value !== 'ALL' ? citizenshipSelect.value : '',
    });
  });

  let isSound = localStorage.getItem('sound');

  const soundPlay = () => {
    audio.play();
    isSound = true;
    soundBtnImg.src = './volume.svg';
    localStorage.setItem('sound', 'sound');
  };

  const soundPause = () => {
    audio.pause();
    isSound = false;
    soundBtnImg.src = './mute.svg';
    localStorage.setItem('sound', '');
  };

  document.addEventListener('click', event => {
    if (isSound) soundPlay();
    const target = event.target;
    if (target.closest('.sound')) {
      if (!isSound) {
        soundPlay();
      } else {
        soundPause();
      }
    }
    if (target.closest('.reset')) {
      moviesSelect.value = 'ALL';
      speciesSelect.value = 'ALL';
      genderSelect.value = 'ALL';
      statusSelect.value = 'ALL';
      citizenshipSelect.value = 'ALL';
      getHeroes({});
    }
  });
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
        if (hero.movies) hero.movies.forEach(movie => moviesSet.add(movie.toUpperCase()));
        speciesSet.add(hero.species ? hero.species.toUpperCase() : 'no data');
        genderSet.add(hero.gender ? hero.gender.toUpperCase() : 'no data');
        statusSet.add(hero.status ? hero.status.toUpperCase() : 'no data');
        citizenshipSet.add(hero.citizenship ? hero.citizenship.toUpperCase() : 'no data');
      });
      getSelects();
      const slider = Slider.create({
        wrapper: 'main',
        slide: '.hero',
        prev: '.prev',
        next: '.next',
      });
      getHeroes(slider);
    })
    .catch(error => console.error(error));
};

start();
