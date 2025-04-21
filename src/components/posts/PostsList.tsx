
import PostCard, { PostData } from "./PostCard";

interface PostsListProps {
  posts: PostData[];
  compact?: boolean;
}

const PostsList = ({ posts, compact = false }: PostsListProps) => {
  return (
    <div className={compact 
      ? "space-y-4" 
      : "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    }>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} compact={compact} />
      ))}
    </div>
  );
};

export default PostsList;
