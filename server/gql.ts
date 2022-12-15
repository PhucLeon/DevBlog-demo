export function discussionGql(ghDiscussionCateforyId: string | undefined) {
    return `{
            repository(name: "DevBlog-demo", owner: "PhucLeon") {
              discussions(first: 100, categoryId: "${ghDiscussionCateforyId}") {
                nodes {
                  title
                  url
                  number
                  bodyHTML
                  bodyText
                  createdAt
                  lastEditedAt
                  author {
                    login
                    url
                    avatarUrl
                  }
                  labels(first: 100) {
                    nodes {
                      name
                    }
                  }
                }
              }
            }
    }`
}

// Single Post

export function discussionDetailGql(postId:number | undefined) {
  return `{
    repository(owner: "PhucLeon", name: "DevBlog-demo") {
      discussion(number: ${postId}) {
        title
        bodyHTML
        createdAt
        author {
          login
          url
          avatarUrl
        }
      }
    }

  }`
}