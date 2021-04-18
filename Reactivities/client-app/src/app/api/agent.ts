import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { IActivity } from "../models/activity";
import { store } from "../stores/store";

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.response.use(undefined, (error: AxiosError) => {
  const { status, data, config } = error.response!;
  switch (status) {
    case 400:
      if (typeof data === "string") {
        toast.error(data);
      }

      if (config.method === "get" && data.errors.hasOwnProperty("id")) {
        history.push("/not-found");
      }
      if (data.errors) {
        const modelStateErrors = [];
        for (const key in data.errors) {
          if (data.errors[key]) modelStateErrors.push(data.errors[key]);
        }
        throw modelStateErrors.flat();
      } else {
        toast.error("Bad Request");
      }
      break;
    case 401:
      toast.error("Unauthorized");
      break;
    case 404:
      toast.error("not found");
      history.push("/not-found");
      break;
    case 500:
      store.commonStore.setServerError(data);
      history.push("/server-error");
      break;
  }
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) =>
    axios
      .post(url, body)
      .then(sleep(1000))
      .then((responseBody) => {
        console.dir(responseBody);
        return responseBody;
      }),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(1000)).then(responseBody),
  del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
};

const Activities: any = {
  list: (): Promise<IActivity[]> => requests.get("/activities"),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post(`/activities`, activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`),
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  Activities,
};
