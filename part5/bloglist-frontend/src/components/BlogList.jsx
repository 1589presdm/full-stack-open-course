import Blog from "./Blog"

const Bloglist = ({ blogs, like, remove, userId}) => {
    return (
        <div>
            <h2>Blogs</h2>
            {[...blogs].sort((a, b) => b.likes - a.likes).map(blog => (
            <Blog key={blog.id} blog={blog} like={like} remove={remove} userId={userId} />))}
        </div>
    )
}
            
export default Bloglist
