export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genres: {
    id: number;
    name: string;
  }[];
  genre_ids: [];
  id: number;
  imdb_id: string;
  overview: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  tagline: string;
  title: string;
  vote_average: number;
  name:string;
  first_air_date:number;
  media_type:string;
}




// {
//   "adult": false,
//   "backdrop_path": "/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg",
//   "genres": [
//     {
//       "id": 28,
//       "name": "Action"
//     },
//     {
//       "id": 878,
//       "name": "Science Fiction"
//     },
//     {
//       "id": 12,
//       "name": "Adventure"
//     },
//     {
//       "id": 53,
//       "name": "Thriller"
//     }
//   ],
//   "id": 912649,
//   "imdb_id": "tt16366836",
//   "overview": "Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision that will bring the curtains down on Venom and Eddie's last dance.",
//   "poster_path": "/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
//   "release_date": "2024-10-22",
//   "runtime": 109,
//   "tagline": "'Til death do they part.",
//   "title": "Venom: The Last Dance",
//   "video": false,
//   "vote_average": 6.8,

// }