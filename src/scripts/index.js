import '../styles/index.scss';
import { EditorUi } from './editor_ui';

function init() {
  new EditorUi();
}

window.onload = init();