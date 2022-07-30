import { Link } from 'react-router-dom';
import PageContainer from '../../components/UI/PageContainer/PageContainer';
import PageHeader from '../../components/UI/PageHeader/PageHeader';

import rentCategoryImage from '../../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../../assets/jpg/sellCategoryImage.jpg';

import styles from './Explore.module.scss';

const Explore = () => {
  return (
    <PageContainer>
      <PageHeader title="Explore" />
      <h3 className={styles.heading}>Categories</h3>
      <div className={styles.categories}>
        <Link to="/categories/rent">
          <img
            className={styles.categoryImg}
            src={rentCategoryImage}
            alt="Places for rent"
          />
          <p className={styles.categoryName}>Places for rent</p>
        </Link>
        <Link to="/categories/sale">
          <img
            className={styles.categoryImg}
            src={sellCategoryImage}
            alt="Places for sale"
          />
          <p className={styles.categoryName}>Places for sale</p>
        </Link>
      </div>
    </PageContainer>
  );
};

export default Explore;
