import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import MovieBanner from "./Movies/MovieBanner";
import MovieCard from "./HomePageCard";
import type { Movie, TvShow } from "types";
import { useContentFetch } from "@/hooks/useContentFetch";

export default function HomePage() {
  const {
    popularMovies,
    topRatedMovies,
    popularTVShows,
    isLoading
  } = useContentFetch();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const renderCarousel = (
    title: string,
    items: Movie[] | TvShow[],
    type: "movie" | "tv"
  ) => (
    <div className="max-w-8xl mt-4 mx-auto">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-2xl font-bold text-white">{title}</h2>
          <div className="flex gap-2 relative">
            <CarouselPrevious className="static translate-y-0 h-8 w-8 bg-white/10 hover:bg-white/20 border-0" />
            <CarouselNext className="static translate-y-0 h-8 w-8 bg-white/10 hover:bg-white/20 border-0" />
          </div>
        </div>
        <CarouselContent className="-ml-2 md:-ml-4">
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-2 md:pl-4 flex-[0_0_50%] sm:flex-[0_0_50%] md:flex-[0_0_30.33%] lg:flex-[0_0_18%] xl:flex-[0_0_14.5%]"
            >
              <MovieCard
                type={type}
                id={item.id}
                title={type === "movie" ? (item as Movie).title : (item as TvShow).name}
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                releaseDate={
                  type === "movie"
                    ? (item as Movie).release_date
                    : (item as TvShow).first_air_date
                }
                genreIds={item.genre_ids}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );

  return (
    <div className="space-y-4">
      <MovieBanner movies={popularMovies} />

      <div className="w-full space-y-8">
        {renderCarousel("Popular Movies", popularMovies, "movie")}
        {renderCarousel("Top Rated Movies", topRatedMovies, "movie")}
        {renderCarousel("Top Rated TV Shows", popularTVShows, "tv")}
        <p className="hidden sm:flex justify-center items-center mt-6 mb-6 text-gray-600">
          This site does not store any files on the server; we only link to the media hosted on
          3rd party services.
        </p>
      </div>
    </div>
  );
}