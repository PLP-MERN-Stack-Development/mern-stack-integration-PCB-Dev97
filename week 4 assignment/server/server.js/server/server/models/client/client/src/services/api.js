import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export default api;

import { useState, useEffect } from 'react';

export const useApi = (serviceFn, ...params) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetch = async () => {
      try {
        const result = await serviceFn(...params);
        if (isMounted) setData(result.data);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetch();

    return () => { isMounted = false; };
  }, [serviceFn, ...params]);

  return { data, loading, error };
};

import React, { createContext, useContext, useReducer } from 'react';

const PostsStateContext = createContext();
const PostsDispatchContext = createContext();

const initialState = {
  posts: [],
  categories: [],
  loading: false,
  error: null
};

function postsReducer(state, action) {
  switch(action.type) {
    case 'FETCH_POSTS_START':
      return { ...state, loading: true };
    case 'FETCH_POSTS_SUCCESS':
      return { ...state, loading: false, posts: action.payload };
    case 'FETCH_POSTS_ERROR':
      return { ...state, loading: false, error: action.payload };
    // add cases for categories, create/edit, delete etc.
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const PostsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postsReducer, initialState);
  return (
    <PostsStateContext.Provider value={state}>
      <PostsDispatchContext.Provider value={dispatch}>
        {children}
      </PostsDispatchContext.Provider>
    </PostsStateContext.Provider>
  );
};

export const usePostsState = () => useContext(PostsStateContext);
export const usePostsDispatch = () => useContext(PostsDispatchContext);
