// TODO: use SQLite instead of own implementation of storage

import watch, { Watcher } from 'node-watch';

import path from 'path';
import { rm } from 'fs/promises';

import { blogPostsDir } from '../../constants';

import { getAttachmentFilenames, getPostFilenames } from './files';
import { PostsContext } from './PostsContext';

type Context = {
	postsContext: PostsContext;
	watcher: Watcher;
};

type RawPostsOptions = {
	attachmentsDir: string;
};

export class RawPosts {
	private readonly options: RawPostsOptions;
	constructor(options: RawPostsOptions) {
		this.options = options;
	}

	public async getPosts() {
		const context = await this.getContext();
		return context.postsContext.parsedPosts;
	}

	public async destroy() {
		if (!this.context) return;

		const context = await this.context;
		context.watcher.close();
		this.context = null;
	}

	private context: null | Promise<Context> = null;
	private getContext() {
		if (!this.context) {
			this.context = this.createContext();
		}

		return this.context;
	}

	private createContext = async (): Promise<Context> => {
		const postsContext = new PostsContext();

		// Update files
		const watcher = watch(
			blogPostsDir,
			{ recursive: true, persistent: false },
			async (_, file) => {
				const extension = path.extname(file);
				if (['.md', '.mdx'].indexOf(extension) !== -1) {
					postsContext.handleFile(file);
				} else {
					postsContext.handleAttachment(file);
				}
			},
		);

		// Clear dir to remove unnecessary files
		await rm(this.options.attachmentsDir, { force: true, recursive: true });

		const attachments = await getAttachmentFilenames();
		await Promise.all(attachments.map(postsContext.handleAttachment));

		const posts = await getPostFilenames();
		await Promise.all(posts.map((file) => postsContext.handleFile(file)));

		return {
			postsContext,
			watcher,
		};
	};
}
