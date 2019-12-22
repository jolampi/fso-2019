import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { incrementLikes, removeBlog } from '../reducers/blogReducer'

import { List } from 'semantic-ui-react'

const BlogList = (props) => {
    const padding = {
        paddingTop: 8
    }

    return (
        <div>
            <List>
                {props.blogs
                    .sort((blog1, blog2) => blog2.likes - blog1.likes)
                    .map(blog =>
                        <List.Item key={blog.id} className="blogItem" style={padding}>
                            <Link to={`/blogs/${blog.id}`}>
                                <List.Header>
                                    {blog.title}
                                    {(blog.author !== '') && <i> - {blog.author}</i>}
                                </List.Header>
                                {blog.likes} likes
                                 · {blog.comments.length} comments
                            </Link>
                        </List.Item>
                    )
                }
            </List>
        </div>
    )
}

BlogList.propTypes = {
    blogs: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    incrementLikes: PropTypes.func.isRequired,
    removeBlog: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    blogs: state.blogs,
    user: state.user
})

export default connect(
    mapStateToProps,
    { incrementLikes, removeBlog }
)(BlogList)
