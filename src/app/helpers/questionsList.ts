import { Question } from "../models/question.model";

export const questionsList: Question[] = [
  {
    id: 1,
    query: 'Jaka jest Twoja płeć?',
    options: [
      {
        id: 0,
        text: 'Kobieta',
      },
      {
        id: 1,
        text: 'Mężczyzna',
      },
    ],
  },
  {
    id: 2,
    query: 'Czy układałaś wcześniej dietę?',
    options: [
      {
        id: 0,
        text: 'Tak',
      },
      {
        id: 1,
        text: 'Nie',
      },
    ],
  },
  {
    id: 3,
    query: 'Jaka jest Twoja prawdopodobna aktywność fizyczna?',
    options: [
      {
        id: 0,
        text: 'Niska',
      },
      {
        id: 1,
        text: 'Umiarkowana',
      },
      {
        id: 2,
        text: 'Wysoka',
      },
    ],
  },
  {
    id: 4,
    query: 'Jaki jest Twój cel?',
    options: [
      {
        id: 0,
        text: 'Chcę schudnąć',
      },
      {
        id: 1,
        text: 'Chcę utrzymać wagę',
      },
      {
        id: 2,
        text: 'Chcę przytyć',
      },
    ],
  },
];
