import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useSnackbar } from 'notistack';
import { Box, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import List from './List';
import useTask from 'src/hooks/useTask';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column'
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
    display: 'flex',
    overflowY: 'hidden',
    overflowX: 'auto'
  },
  inner: {
    display: 'flex',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
}));

const KanbanView = () => {
  const classes = useStyles();
  //const { lists } = useSelector((state) => state.kanban);
  const { enqueueSnackbar } = useSnackbar();
  const { getTasks, tasks, updateTask } = useTask();

  useEffect(() => {
   getTasks();
   //eslint-disable-next-line
  }, [])

  const moveCard = (state, action) => {
    // const { cardId, position, listId } = action;
    // const { listId: sourceListId } = state.cards.byId[cardId];
    // Remove card from source list
    // _.pull(list.byId[sourceListId].cardIds, cardId);

    // If listId arg exists, it means that
    // we have to add the card to the new list
    // if (listId) {
    //   state.cards.byId[cardId].listId = listId;
    //   state.lists.byId[listId].cardIds.splice(position, 0, cardId);
    // } else {
    //   state.lists.byId[sourceListId].cardIds.splice(position, 0, cardId);
    // }
  }

  const handleDragEnd = async ({ source, destination, draggableId }) => {
    try {

      await updateTask({status: destination.droppableId}, draggableId);

      // Dropped outside the list
      if (!destination) {
        return;
      }

      // Card has not been moved
      if (
        source.droppableId === destination.droppableId
        && source.index === destination.index
      ) {
        return;
      }

      if (source.droppableId === destination.droppableId) {
      // Moved to the same list on diferent position
        moveCard(draggableId, destination.index);
      } else {
      // Moved to another list
        moveCard(draggableId, destination.index, destination.droppableId);
      }

      enqueueSnackbar('Card moved', {
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  let list = [
      {
        id: '5e849c39325dc5ef58e5a5db',
        name: 'To Do',
        value: 'to do',
        tasks: []
      },
      {
        id: '5e849c2b38d238c33e516754',
        name: 'In progress',
        value: 'in progress',
        tasks: []
      },
      {
        id: '5e849c2b38d238c33e516755',
        name: 'Done',
        value: 'done',
        tasks: []
      }
    ];
  
  useEffect(() => {

    tasks.map(task => 
      list.map(item => 
        item.value === task.status ? item.tasks.push(task) : false
      ));

    setNewList(list)
    //eslint-disable-next-line
  }, [tasks])
   
  const [newList, setNewList] = useState();
  
  return (
    <Page
      className={classes.root}
      title="Kanban Board"
    >
      <Box p={3}>
        <Header />
      </Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={classes.content}>
          <div className={classes.inner}>
            {newList && newList.map((item) => (
              <List
                key={item.id}
                item={item}
              />
            ))}
            {/*<ListAdd />*/}
          </div>
        </div>
      </DragDropContext>
    </Page>
  );
};

export default KanbanView;
