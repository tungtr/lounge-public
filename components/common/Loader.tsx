// Styling
import loaderStyles from '@styles/layout/Loader.module.css';

const Loader = () => {
  return (
    <div className={loaderStyles.container}>
      <div className={loaderStyles.loader}>
        <div className={loaderStyles.bead} style={{ animationDelay: '-2s' }} />
        <div className={loaderStyles.bead} style={{ animationDelay: '-1s' }} />
        <div className={loaderStyles.bead} style={{ animationDelay: '0s' }} />
      </div>
    </div>
  );
};

export default Loader;