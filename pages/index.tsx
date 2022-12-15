import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useEffect, useMemo, useState } from "react";
import BlogPreview from "../components/BlogPreview";
import { getBlogs } from "../server/blogs";
import { BlogPost } from "../types/blog";

const Home: NextPage = ({
  blogData,
  tags,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [filterWord, setFilterWord] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number[]>([]);

  const filterBlog: BlogPost[] = useMemo(() => {
    return filterWord.length > 0
      ? blogData.filter((blog: BlogPost) => {
          return filterWord.every((filter) => blog.tags.includes(filter));
        })
      : blogData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterWord]);

  const filterLabel = (tag: any, idx: number) => {
    if (selectedIdx.includes(idx)) {
      setSelectedIdx(selectedIdx.filter((id) => id !== idx));
      setFilterWord(filterWord.filter((filter) => filter !== tag.innerText));
    } else {
      setSelectedIdx([...selectedIdx, idx]);
      setFilterWord([...filterWord, tag.innerText]);
    }
  };

  useEffect(() => {
    console.log(filterWord);
  }, [filterWord]);

  return (
    <main className="layout">
      <title>Home Page</title>
      <section>
        <div className="mt-3 text-center">
          <h1 className="text-[3rem]">Welcome to Ginger</h1>
          <p className="text-[1rem]">
            Mọi vết thương đều được chữa thành bằng tình thương
          </p>
        </div>
      </section>

      <section className="flex flex-col items-center text-[1.15rem] mt-12">
        <div className="flex gap-3 mb-12">
          {tags.map((tag: string, idx: number) => {
            return (
              <button
                className={`${
                  selectedIdx.includes(idx)
                    ? "label-selected hover:bg-sky-400 transition-all duration-300"
                    : "label hover:bg-sky-400 transition-all duration-300"
                }`}
                key={idx}
                onClick={(e) => filterLabel(e.target, idx)}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {filterBlog.map((blog: BlogPost) => {
          return (
            <div
              key={blog.id}
              className="max-w-[28rem] max-h-[20rem] overflow-hidden mx-6 mb-6 bg-neutral-300 text-zinc-800 rounded-lg p-4 hover:bg-neutral-500 hover:text-neutral-300 transition-all duration-300"
            >
              <a href={blog.url} target="_blank" rel="noreferrer">
                <BlogPreview
                  title={blog.title}
                  bodyText={blog.bodyText}
                  createdAt={blog.createdAt}
                  author={blog.author}
                  tags={blog.tags}
                />
              </a>
            </div>
          );
        })}
      </section>

      <footer className="my-[2rem]">
        <hr className="text-neutral-200 mb-8"/>
        <div className="text-center">
          <p>Bản quyền nội dung thuộc về Ginger-Gừng</p>
          <div className="text-blue-400 underline">
            <a
              href="https://www.facebook.com/profile.php?id=100075734926497&mibextid=ZbWKwL"
              target="_blank"
              rel="noreferrer"
            >
              Ginger-Gừng
            </a>
          </div>
          <p>Sản phẩm dùng cho mục đích học tập!</p>
          <hr className="my-[24px]"/>
          <p className="text-sm">Fullstack blog made with Next.js, TailwindCSS, github GraphQL</p>
        </div>
      </footer>
    </main>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  let blogs: BlogPost[] = await getBlogs();
  // console.log(blogs);

  let tags: string[] = [];

  for (const blog of blogs) {
    for (const tag of blog.tags) {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
  }

  // console.log(tags);

  return {
    props: {
      blogData: blogs,
      tags: tags,
    },
  };
};
