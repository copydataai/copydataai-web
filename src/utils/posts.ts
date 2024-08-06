import type { CollectionEntry } from "astro:content";

import { SITE } from "@config";
import { slugifyAll } from "./slugify";

export const getPostsByTag = (posts: CollectionEntry<"blog">[], tag: string) =>
	posts.filter((post) => slugifyAll(post.data.tags).includes(tag));

export const getSortedPosts = (posts: CollectionEntry<"blog">[]) =>
	posts
		.filter(({ data }) => !data.draft)
		.sort(
			(a, b) =>
				Math.floor(new Date(b.data.pubDatetime).getTime() / 1000) -
				Math.floor(new Date(a.data.pubDatetime).getTime() / 1000),
		);

export const getPageNumbers = (numberOfPosts: number) => {
	const numberOfPages = numberOfPosts / Number(SITE.postPerPage);

	let pageNumbers: number[] = [];
	for (let i = 1; i <= Math.ceil(numberOfPages); i++) {
		pageNumbers = [...pageNumbers, i];
	}

	return pageNumbers;
};

interface GetPaginationProps<T> {
	posts: T;
	page: string | number;
	isIndex?: boolean;
}

export const getPagination = <T>({
	posts,
	page,
	isIndex = false,
}: GetPaginationProps<T[]>) => {
	const totalPagesArray = getPageNumbers(posts.length);
	const totalPages = totalPagesArray.length;

	const currentPage = isIndex
		? 1
		: page && !isNaN(Number(page)) && totalPagesArray.includes(Number(page))
			? Number(page)
			: 0;

	const lastPost = isIndex ? SITE.postPerPage : currentPage * SITE.postPerPage;
	const startPost = isIndex ? 0 : lastPost - SITE.postPerPage;
	const paginatedPosts = posts.slice(startPost, lastPost);

	return {
		totalPages,
		currentPage,
		paginatedPosts,
	};
};
