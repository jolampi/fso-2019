import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { incrementLikes, removeBlog } from '../reducers/blogReducer'

const BlogList = (props) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderColor: 'lightgrey',
        borderWidth: 1,
        marginBottom: 5
    }

    const listStyle = {
        paddingLeft: 0,
        listStyleType: 'none'
    }

    return (
        <div>
            <ul style={listStyle}>
                {props.blogs
                    .sort((blog1, blog2) => blog2.likes - blog1.likes)
                    .map(blog =>
                        <li key={blog.id} style={blogStyle}>
                            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                        </li>
                    )
                }
            </ul>
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
