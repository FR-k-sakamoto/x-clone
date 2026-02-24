export class SearchUserResult {
  constructor(
    private readonly userId: string,
    private readonly handle: string,
    private readonly name: string,
    private readonly bio: string
  ) {}

  getUserId() {
    return this.userId;
  }

  getHandle() {
    return this.handle;
  }

  getName() {
    return this.name;
  }

  getBio() {
    return this.bio;
  }
}

export class SearchPostResult {
  constructor(
    private readonly postId: string,
    private readonly authorId: string,
    private readonly authorHandle: string,
    private readonly body: string,
    private readonly createdAt: Date
  ) {}

  getPostId() {
    return this.postId;
  }

  getAuthorId() {
    return this.authorId;
  }

  getAuthorHandle() {
    return this.authorHandle;
  }

  getBody() {
    return this.body;
  }

  getCreatedAt() {
    return this.createdAt;
  }
}
