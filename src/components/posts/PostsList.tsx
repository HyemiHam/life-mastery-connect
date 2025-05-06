import PostCard, { PostData } from "./PostCard";

interface PostsListProps {
  posts: PostData[];
  compact?: boolean;
  onPostClick?: (id: string) => void;
}

const PostsList = ({ posts, compact = false, onPostClick }: PostsListProps) => {
  return (
    <div className={compact 
      ? "space-y-4" 
      : "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    }>
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          compact={compact} 
          onPostClick={onPostClick}
        />
      ))}
    </div>
  );
};

export default PostsList;
