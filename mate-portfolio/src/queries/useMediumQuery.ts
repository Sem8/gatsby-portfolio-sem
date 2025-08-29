import { graphql, useStaticQuery } from 'gatsby';
import { MediumAuthor, MediumPost } from '../types';
import { MEDIUM_CDN, MEDIUM_URL } from '../utils/constants';

export type QueryResponse = {
  site: {
    siteMetadata: {
      isMediumUserDefined: boolean;
    };
  };
  mediumUser: {
    id: string;
    username: string;
    name: string;
    posts: {
      id: string;
      uniqueSlug: string;
      title: string;
      createdAt: string;
      virtuals: {
        subtitle: string;
        readingTime: number;
        previewImage: {
          imageId: string;
        };
      };
    }[];
  };
};

type Response = {
  posts: MediumPost[];
  author: MediumAuthor | null;
};

const EMPTY_RESPONSE = { author: null, posts: [] };

export const useMediumQuery = (): Response => {
  // const { mediumUser } = useStaticQuery<QueryResponse>(graphql`
  //   query MediumPostQuery {
  //     mediumUser {
  //       id
  //       name
  //       username
  //       posts {
  //         id
  //         uniqueSlug
  //         title
  //         createdAt(formatString: "MMM YYYY")
  //         virtuals {
  //           subtitle
  //           readingTime
  //           previewImage {
  //             imageId
  //           }
  //         }
  //       }
  //     }
  //   }
  // `);

  // const { posts: rawPosts, ...author } = mediumUser;

  // if (author.username === '@medium') return EMPTY_RESPONSE;

  // const posts = rawPosts.map((p) => ({
  //   title: p.title,
  //   text: p.virtuals.subtitle,
  //   cover: `${MEDIUM_CDN}/${p.virtuals.previewImage.imageId}`,
  //   // url: `${MEDIUM_URL}/@${mediumUser.username}/${p.uniqueSlug}`,
  //   url: `${MEDIUM_URL}/@${mediumUser.username}`,
  //   date: p.createdAt,
  //   time: p.virtuals.readingTime,
  // }));

  const { allFeedMediumFeed } = useStaticQuery(graphql`
  query MediumPostQuery {
    allFeedMediumFeed(limit: 5) {
      nodes {
        title
        link
        pubDate(formatString: "MMM YYYY")
        contentSnippet
      }
    }
  }
`);

const { posts: rawPosts, ...author } = allFeedMediumFeed;


const posts = allFeedMediumFeed.nodes.map((p: { title: any; contentSnippet: any; link: any; pubDate: any; }) => ({
  title: p.title,
  text: p.contentSnippet,
  url: p.link,
  date: p.pubDate,
}));

  return {
    posts,
    author,
  };
};
