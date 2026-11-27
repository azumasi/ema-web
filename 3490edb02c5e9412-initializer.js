// trunk が生成する起動処理の前後で呼ばれる。読み込み中の表示と、起動できなかったときの理由表示を担う。
const status = () => document.getElementById('ema-status');
const error = () => document.getElementById('ema-error');

function webgl2() {
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
}
function fail(text) {
  status().hidden = true;
  error().textContent = text;
  error().hidden = false;
}

export default function initializer() {
  return {
    onStart() {
      if (typeof WebAssembly !== 'object') {
        fail('このブラウザはWebAssemblyに対応していません。新しいバージョンのChrome・Edge・Firefox・Safariでお試しください。');
      } else if (!webgl2()) {
        fail('このブラウザまたは端末ではWebGL 2が使えないため、描画できません。ハードウェアアクセラレーションの設定を確認するか、別のブラウザでお試しください。');
      }
    },
    onSuccess() {
      status().hidden = true;
    },
    onFailure(e) {
      // winit(Web)は、イベントループを開始するときに制御用の例外を投げる。エラーではない。
      if (String(e).includes('Using exceptions for control flow')) {
        status().hidden = true;
        return;
      }
      // 対応していない旨を先に出している場合は、その表示を残す。
      if (error().hidden) {
        fail('起動できませんでした: ' + e);
      }
    },
  };
}
