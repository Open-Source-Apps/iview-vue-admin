/**
 * Created by Tony on 14/06/2017.
 */
import axios from 'axios';
import store from '../store'
import Message from 'iview/src/components/message';
axios.defaults.baseURL = `${process.env.BASE_URL}/api`
// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${store.getters.token}`;
      config.headers['Content-Type'] = 'application/json'
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息
          store.dispatch('logout');
          break;
        case 500:
          Message.error('服务器出了小问题')
          break;


      }
    }
    return Promise.reject(error)
  });
const httpUtil =
    {
        fetch: axios,
        cleanArray: function (actual) {
            const newArray = [];
            for (let i = 0; i < actual.length; i++) {
                if (actual[i]) {
                    newArray.push(actual[i]);
                }
            }
            return newArray;
        },
        createRequestOption: function (params) {
            if (!params || params === 'undefined' || params === undefined) return '';
            return this.cleanArray(Object.keys(params).map(key => {
                if (!params[key] || params[key] === undefined || params[key] === 'undefined') return '';
                if (key === 'page') {
                    return encodeURIComponent(key) + '=' +
                        encodeURIComponent(params[key] - 1);
                }
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(params[key]);
            })).join('&');
        },
        createQueryOption: function (params) {
            if (!params) {
                return ''
            }
            let options = '?';

            let {page, size, sortWay} = params;

            if (page && size) {
                page--;
                options = options + 'page=' + parseInt(page, 10) + '&size=' + parseInt(size, 10);
            }

            let sort = null;
            if (sortWay) {
                let {prop, order} = sortWay;

                if (prop) {
                    if (order === 'descending') {
                        order = 'desc';
                    } else {
                        order = 'asc';
                    }
                    sort = prop + ',' + order;
                }
            }
            if (sort) {
                options = options + '&sort=' + sort;
            }
            return options;
        },
        createSearchOption: function (params) {
            let options = '?';

            let {page, size, sortWay} = params;

            if (page && size) {
                page--;
                options = options + 'page=' + parseInt(page, 10) + '&size=' + parseInt(size, 10);
            }

            let sort = null;
            if (sortWay) {
                let {prop, order} = sortWay;

                if (prop) {
                    if (order === 'descending') {
                        order = 'desc';
                    } else {
                        order = 'asc';
                    }
                    sort = prop + ',' + order;
                }
            }
            if (sort) {
                options = options + '&sort=' + sort;
            }
            return options;
        }
    };

export default httpUtil;
