import regap from './regap';

export default regap;

if (typeof window !== 'undefined') {
    window.regap = regap;
}
