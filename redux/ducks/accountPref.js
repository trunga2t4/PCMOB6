export const CHANGE_MODE = "change_mode";
export const DEFAULT_MODE = "default_mode";
export const LIGHT_MODE = "light_mode";
export const DARK_MODE = "dark_mode";
export const UPLOAD_PIC = "upload_pic";
export const DELETE_PIC = "delete_pic";

export function changeMode() {
  return { type: CHANGE_MODE };
}
export function defaultMode() {
  return { type: DEFAULT_MODE };
}

export function lightMode() {
  return { type: LIGHT_MODE };
}

export function darkMode() {
  return { type: DARK_MODE };
}

export function uploadPic() {
  return { type: UPLOAD_PIC };
}

export function deletePic() {
  return { type: DELETE_PIC };
}

const initialState = {
  isDark: true,
  profilePicture: null,
};

export default function accountPrefReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_MODE:
      return { ...state, isDark: !state.isDark };
    case DEFAULT_MODE:
      return { ...state, isDark: null };
    case LIGHT_MODE:
      return { ...state, isDark: false };
    case DARK_MODE:
      return { ...state, isDark: true };
    case UPLOAD_PIC:
      return { ...state, profilePicture: action.payload };
    case DELETE_PIC:
      return { ...state, profilePicture: null };
    default:
      return state;
  }
}
