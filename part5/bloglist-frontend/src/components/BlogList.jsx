import { Link } from 'react-router-dom'

const Bloglist = ({ blogs, like, remove, userId }) => {
    return (
        <div>
            <h2>Blogs</h2>
            <ul>
                {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
                    <li key={blog.id}>
                        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default Bloglist
