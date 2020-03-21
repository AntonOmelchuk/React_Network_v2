import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';

import style from './Users.module.css';

import UserItem from './UserItem';
import Spinner from '../common/waitingComponents/Spinner';

import {
  followUser,
  getUsers,
  setCurrentPage,
  toggleFetching,
  unFollowUser,
} from '../../actions/usersActions';
import { startNewDialog } from '../../actions/dialogsActions';
import { AppStateType } from '../../reducers';

type OwnPropsType = {
  getUsers: (currentPage: number) => void;
  setCurrentPage: (page: number) => void;
  toggleFetching: () => void;
  followUser: () => void;
  unFollowUser: () => void;
  startNewDialog: () => void;
};

type MapStateToPropsType = {
  users: Array<UserType>;
  totalCount: number;
  pageSize: number;
  currentPage: number;
  isFetching: boolean;
  disabledButton: Array<number>;
  auth: boolean;
};

type MapDispatchToPropsType = {};

type PropsType = OwnPropsType & MapStateToPropsType & MapDispatchToPropsType;

const Users: React.FC<PropsType> = props => {
  const {
    users,
    totalCount,
    pageSize,
    getUsers,
    currentPage,
    setCurrentPage,
    toggleFetching,
    isFetching,
    followUser,
    unFollowUser,
    disabledButton,
    startNewDialog,
  } = props;

  useEffect(() => {
    document.title = 'Users';
    toggleFetching();
    getUsers(currentPage);
  }, [currentPage, getUsers, toggleFetching]);

  useEffect(
    () => () => {
      setCurrentPage(1);
    },
    [setCurrentPage]
  );

  const pagesCount = Math.ceil(totalCount / pageSize);
  const pages = [];

  for (let i = 1; i <= pagesCount; i++) {
    pages.push(i);
  }

  const handleCurrentPage = (e: { selected: number }) => {
    setCurrentPage(e.selected + 1);
  };

  return (
    <div className={style.wrapper}>
      <div>
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={pagesCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={10}
          onPageChange={e => handleCurrentPage(e)}
          containerClassName={style.pagination}
          // @ts-ignore
          subContainerClassName={style.pages__pagination}
          activeClassName={style.current}
        />
      </div>
      {isFetching ? (
        <Spinner />
      ) : (
        users.map(user => (
          <UserItem
            key={user.id}
            user={user}
            followUser={followUser}
            unFollowUser={unFollowUser}
            disabledButton={disabledButton}
            startNewDialog={startNewDialog}
          />
        ))
      )}
    </div>
  );
};

const mapStateToProps = (state: AppStateType): MapStateToPropsType => ({
  users: state.users.users,
  totalCount: state.users.totalCount,
  pageSize: state.users.pageSize,
  currentPage: state.users.currentPage,
  isFetching: state.users.isFetching,
  disabledButton: state.users.disabledButton,
  auth: state.auth.isAuth,
});

export default connect<
  MapStateToPropsType,
  MapDispatchToPropsType,
  OwnPropsType,
  AppStateType
>(mapStateToProps, {
  getUsers,
  setCurrentPage,
  toggleFetching,
  followUser,
  unFollowUser,
  startNewDialog,
})(Users);
