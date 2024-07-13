import { CSSProperties } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CSSPropertiesWithVars extends CSSProperties {
  '--toastify-color-progress-error': string;
  '--toastify-icon-color-error': string;
}

function showCustomAlert(message: string) {
  const notify = () => toast.error(message, {
    style: {
      '--toastify-color-progress-error': '#EB811F', '--toastify-icon-color-error': '#EB811F', color: '#2B2A29', whiteSpace: 'pre-line', textAlign: 'center', fontSize: 'calc(30*100vh/1080)', height: 'calc(300*100vh/1080)', width: 'calc(650*100vh/1080)',
    } as CSSPropertiesWithVars,
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  notify();
}

export { ToastContainer, showCustomAlert };
