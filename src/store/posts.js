import { defineStore } from 'pinia'
import postsData from '../data/mock/posts.json'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [],
    loading: false
  }),

  getters: {
    getPostsByCourse: (state) => (courseId) => {
      return state.posts
        .filter(post => post.courseId === courseId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    },
    getPostById: (state) => (postId) => {
      return state.posts.find(post => post.id === postId)
    }
  },

  actions: {
    async loadPosts() {
      this.loading = true
      await new Promise(resolve => setTimeout(resolve, 400))
      this.posts = postsData
      this.loading = false
    },

    async createPost(postData) {
      const newPost = {
        id: Date.now().toString(),
        ...postData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: []
      }
      
      this.posts.unshift(newPost)
      this.persistToStorage()
      
      return newPost
    },

    async updatePost(postId, updates) {
      const postIndex = this.posts.findIndex(post => post.id === postId)
      if (postIndex !== -1) {
        this.posts[postIndex] = {
          ...this.posts[postIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        this.persistToStorage()
      }
    },

    async deletePost(postId) {
      this.posts = this.posts.filter(post => post.id !== postId)
      this.persistToStorage()
    },

    async addComment(postId, commentData) {
      const post = this.getPostById(postId)
      if (post) {
        const newComment = {
          id: Date.now().toString(),
          ...commentData,
          createdAt: new Date().toISOString()
        }
        
        post.comments.push(newComment)
        this.persistToStorage()
        
        return newComment
      }
    },

    async deleteComment(postId, commentId) {
      const post = this.getPostById(postId)
      if (post) {
        post.comments = post.comments.filter(comment => comment.id !== commentId)
        this.persistToStorage()
      }
    },

    persistToStorage() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('posts', JSON.stringify(this.posts))
      }
    },

    loadFromStorage() {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('posts')
        if (stored) {
          this.posts = JSON.parse(stored)
        } else {
          this.posts = postsData
        }
      }
    }
  }
})
