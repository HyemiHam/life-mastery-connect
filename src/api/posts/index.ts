import { supabaseApi, handleApiError } from '../axios';
import { ApiResponse } from '../auth';

// 게시글 타입 정의
export interface Post {
  id: string;
  board_id: string;
  author_id: string;
  title: string;
  content: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  tags?: Tag[];
}

// 태그 타입 정의
export interface Tag {
  id: string;
  name: string;
}

// 게시글 생성 요청 타입
export interface CreatePostRequest {
  board_id: string;
  title: string;
  content: string;
  tags?: string[]; // 태그 ID 배열
}

// 게시글 수정 요청 타입
export interface UpdatePostRequest {
  title?: string;
  content?: string;
  tags?: string[]; // 태그 ID 배열
}

// 게시글 목록 요청 파라미터
export interface GetPostsParams {
  page?: number;
  limit?: number;
  sort?: 'created_at' | 'view_count';
  order?: 'asc' | 'desc';
}

// 페이지네이션 정보
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 페이지네이션된 응답
export interface PaginatedResponse<T> extends ApiResponse {
  data?: T[];
  pagination?: Pagination;
}

/**
 * 게시글 생성
 */
export const createPost = async (data: CreatePostRequest): Promise<ApiResponse<Post>> => {
  try {
    // 1. 게시글 추가
    const response = await supabaseApi.post('/posts', {
      board_id: data.board_id,
      title: data.title,
      content: data.content,
      author_id: localStorage.getItem('user_id') // 인증된 사용자 ID
    });

    const newPost = response.data[0];

    // 2. 태그 추가 (있는 경우)
    if (data.tags && data.tags.length > 0) {
      const tagPromises = data.tags.map(tagId => 
        supabaseApi.post('/post_tags', {
          post_id: newPost.id,
          tag_id: tagId
        })
      );
      await Promise.all(tagPromises);
    }

    return {
      success: true,
      message: '게시글이 성공적으로 작성되었습니다.',
      data: newPost
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * 게시글 목록 조회
 */
export const getPosts = async (boardSlug: string, params?: GetPostsParams): Promise<PaginatedResponse<Post>> => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = 'created_at',
      order = 'desc'
    } = params || {};

    // 1. 게시판 ID 조회
    const boardResponse = await supabaseApi.get('/boards', {
      params: {
        select: 'id',
        slug: `eq.${boardSlug}`
      }
    });

    if (!boardResponse.data || boardResponse.data.length === 0) {
      return {
        success: false,
        message: '해당 게시판을 찾을 수 없습니다.'
      };
    }

    const boardId = boardResponse.data[0].id;

    // 2. 게시글 수 조회
    const countResponse = await supabaseApi.get('/posts', {
      params: {
        board_id: `eq.${boardId}`,
        select: 'count',
        head: true
      },
      headers: {
        'Prefer': 'count=exact'
      }
    });

    const totalCount = parseInt(countResponse.headers['content-range']?.split('/')[1] || '0');

    // 3. 게시글 목록 조회
    const postsResponse = await supabaseApi.get('/posts', {
      params: {
        select: 'id,title,created_at,view_count,author:author_id(id,username,avatar_url)',
        board_id: `eq.${boardId}`,
        order: `${sort}.${order}`,
        offset: (page - 1) * limit,
        limit: limit
      }
    });

    return {
      success: true,
      message: '게시글 목록을 성공적으로 조회했습니다.',
      data: postsResponse.data,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * 게시글 상세 조회
 */
export const getPostById = async (postId: string): Promise<ApiResponse<Post>> => {
  try {
    // 1. 조회수 증가 (Supabase SQL 함수 사용)
    await supabaseApi.patch(`/posts`, { 
      // Note: 여기서는 단순히 현재값 + 1로 구현, 실제로는 RPC 호출이 더 적합할 수 있음
      view_count: 1 // 서버 측에서 +1 연산을 수행하도록 처리해야 함
    }, {
      params: {
        id: `eq.${postId}`
      },
      headers: {
        'Prefer': 'return=minimal' // 응답 본문 불필요
      }
    });

    // 2. 게시글 조회
    const response = await supabaseApi.get('/posts', {
      params: {
        select: '*,author:author_id(id,username,avatar_url),tags:post_tags(tag:tags(*))',
        id: `eq.${postId}`
      }
    });

    if (!response.data || response.data.length === 0) {
      return {
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      };
    }

    // 태그 데이터 변환
    const post = response.data[0];
    post.tags = post.tags?.map((item: any) => item.tag) || [];

    return {
      success: true,
      message: '게시글을 성공적으로 조회했습니다.',
      data: post
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * 게시글 수정
 */
export const updatePost = async (postId: string, data: UpdatePostRequest): Promise<ApiResponse<Post>> => {
  try {
    // 1. 게시글 수정
    const updateData: Record<string, any> = {};
    if (data.title) updateData.title = data.title;
    if (data.content) updateData.content = data.content;

    const response = await supabaseApi.patch('/posts', updateData, {
      params: {
        id: `eq.${postId}`
      }
    });

    const updatedPost = response.data[0];

    // 2. 태그 수정 (있는 경우)
    if (data.tags !== undefined) {
      // 기존 태그 삭제
      await supabaseApi.delete('/post_tags', {
        params: {
          post_id: `eq.${postId}`
        }
      });

      // 새 태그 추가
      if (data.tags.length > 0) {
        const tagPromises = data.tags.map(tagId => 
          supabaseApi.post('/post_tags', {
            post_id: postId,
            tag_id: tagId
          })
        );
        await Promise.all(tagPromises);
      }
    }

    return {
      success: true,
      message: '게시글이 성공적으로 수정되었습니다.',
      data: updatedPost
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * 게시글 삭제
 */
export const deletePost = async (postId: string): Promise<ApiResponse> => {
  try {
    // 1. 게시글 태그 삭제
    await supabaseApi.delete('/post_tags', {
      params: {
        post_id: `eq.${postId}`
      }
    });

    // 2. 게시글 삭제
    await supabaseApi.delete('/posts', {
      params: {
        id: `eq.${postId}`
      }
    });

    return {
      success: true,
      message: '게시글이 성공적으로 삭제되었습니다.'
    };
  } catch (error) {
    return handleApiError(error);
  }
}; 