import '../styles/index.scss';
import { EditorUi } from './editor-ui/editorUi';

function init() {
  new EditorUi();
}

window.onload = init();