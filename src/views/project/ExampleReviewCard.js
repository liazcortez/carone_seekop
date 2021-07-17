// componente para para utilizarlo como ejemplo
import React, { Component } from 'react';

export default class ExampleReviewCard extends Component {
  render() {
    return (
      <div>
        <Modal onClose={handleClose} open={open}>
          <Formik
            enableReinitialize
            initialValues={{
              actions: '',
              reschedule: date,
              submit: null
            }}
            onSubmit={async (
              values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                if (selectedActions.length === 0) {
                  setErrors({ submit: t('Errors.Min1') });
                } else if (substatus === '') {
                  setErrors({ submit: t('Yup.SelectSubstatus') });
                } else if (value.length > 500) {
                  setErrors({
                    submit: t(
                      'Errors.Comment_can_not_be_more_than_500_characters'
                    )
                  });
                } else if (moment(date).isBefore(moment())) {
                  setErrors({ submit: t('Yup.TodayT') });
                } else if (reminder && current === -1) {
                  setErrors({ submit: t('Yup.SelectReminder') });
                } else if (selectedActions.length > 3) {
                  setErrors({ submit: t('Errors.Max3') });
                } else {
                  let bodyLead = {
                    status,
                    substatus
                  };

                  let userId = '';
                  let author = '';

                  if (
                    user &&
                    user.role &&
                    (user.role === 'rockstar' ||
                      user.role === 'admin' ||
                      user.role === 'super admin') &&
                    lead.agent &&
                    lead.agent._id
                  ) {
                    userId = lead.agent._id;
                    author = user._id;
                  }

                  if (
                    user &&
                    user.role &&
                    (user.role === 'rockstar' ||
                      user.role === 'admin' ||
                      user.role === 'super admin') &&
                    comment &&
                    comment.user
                  ) {
                    userId = comment.user._id;
                    author = user._id;
                  }

                  if (user && user.role && user.role === 'user') {
                    userId = user._id;
                  }

                  let BodyComment = {
                    comment: value,
                    user: userId,
                    action: selectedActions,
                    reschedule: date
                  };

                  if (author !== '') {
                    BodyComment.assignedBy = author;
                  }

                  if (userId === '') {
                    setErrors({ submit: t('Yup.NoAgent') });
                  } else {
                    if (contactedStatus.includes(substatus)) {
                      bodyLead.isContacted = true;
                    }

                    if (!lead.firstTask) {
                      bodyLead.firstTask = new Date();
                    }

                    if (comment) {
                      await updateComment({ pending: false }, comment._id);

                      BodyComment.store = comment.lead.store;

                      await createComment(BodyComment, comment.lead._id);

                      if (
                        user.role === 'rockstar' ||
                        user.role === 'super admin'
                      ) {
                        await getComments();
                      }

                      if (user.role === 'admin') {
                        await getCommentsByStore(
                          `&store[in]=${getMultiStoresIds(user.stores)}`
                        );
                      }
                      if (user.role === 'user') {
                        await getCommentsByUser(user._id);
                      }
                    } else {
                      BodyComment.store = lead.store;

                      if (lead && lead.comments && lead.comments[0]) {
                        await updateComment(
                          { pending: false },
                          lead.comments[0]._id
                        );
                      }

                      await createComment(BodyComment, lead._id);
                      await updateLead(bodyLead, lead._id);
                    }

                    setSelectedActions([]);
                    setStatus('');
                    setSubstatus('');

                    setDate(
                      moment()
                        .endOf('hour')
                        .add('1', 'minute')
                    );
                    setReminderDate(moment(date).subtract('5', 'minutes'));

                    setReminder(false);
                    setCurrent(-1);
                    setValue('');
                    setOpen(false);

                    resetForm();
                  }
                }
              } catch (err) {
                console.error(err);
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }}
          >
            {({
              errors,
              handleBlur,
              handleSubmit,
              handleChange,
              isSubmitting,
              setFieldTouched,
              setFieldValue,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Card className={classes.root}>
                  <CardContent>
                    <Box p={2}>
                      {comment && (
                        <>
                          <Box>
                            <CommentInfo comment={comment} />
                          </Box>
                          <Divider className={classes.divider} />
                        </>
                      )}
                      <Typography
                        variant="h3"
                        color="textPrimary"
                        style={{ marginTop: '1em', marginBottom: '1em' }}
                      >
                        {t('Titles.CreateTask')}
                      </Typography>
                      <Typography
                        variant="h4"
                        color="textPrimary"
                        style={{ marginTop: '1em' }}
                      >
                        1. {t('Comments.Actions')}
                      </Typography>
                      <Divider className={classes.divider} />
                      <Box>
                        <List className={classes.flexContainer}>
                          {enumActions.map((action, index) => (
                            <ListItem
                              key={index}
                              onClick={() => handleSetAction(action)}
                            >
                              <Checkbox
                                checked={selectedActions.includes(action)}
                                onClick={() => handleSetAction(action)}
                                name={action}
                              />
                              <ListItemAvatar>
                                <Avatar className={classes[action]}>
                                  {actionIcons[action]}
                                </Avatar>
                              </ListItemAvatar>
                              <Typography
                                color="textPrimary"
                                variant="body1"
                                style={{
                                  display: 'block',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden'
                                }}
                              >
                                {t(`Errors.${CapitalizeNames(action)}`)}
                              </Typography>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                      {comment && (
                        <>
                          <Typography
                            variant="h4"
                            color="textPrimary"
                            style={{ marginTop: '1em' }}
                          >
                            2. {t('Comments.Comment')}
                          </Typography>
                          <Divider className={classes.divider} />

                          <Box>
                            <Grid container spacing={3} style={{ padding: 15 }}>
                              <Grid item xs={12} sm={12} md={12} lg={12}>
                                <TextField
                                  fullWidth
                                  name="substatus"
                                  onChange={e => {
                                    setValue(e.target.value);
                                  }}
                                  variant="outlined"
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </>
                      )}
                      <Typography
                        variant="h4"
                        color="textPrimary"
                        style={{ marginTop: '1em' }}
                      >
                        {comment ? '3.' : '2.'}
                        {t('Comments.Status')}
                      </Typography>
                      <Divider className={classes.divider} />
                      <Box>
                        <Grid container spacing={3} style={{ padding: 15 }}>
                          <Grid item xs={12} sm={12} md={6} lg={6}>
                            <TextField
                              fullWidth
                              name="status"
                              select
                              onChange={e => {
                                setStatus(e.target.value);
                                setSubstatus('');
                              }}
                              SelectProps={{ native: true }}
                              variant="outlined"
                            >
                              {comment
                                ? statuses.map(
                                    status =>
                                      comment.lead &&
                                      comment.lead.status &&
                                      status.name ===
                                        comment.lead.status.name && (
                                        <option
                                          key={status._id}
                                          value={status._id}
                                          name={status.name}
                                        >
                                          {status && t(`Keys.${status.name}`)}
                                        </option>
                                      )
                                  )
                                : statuses.map(
                                    status =>
                                      lead &&
                                      lead.status &&
                                      status.name === lead.status.name && (
                                        <option
                                          key={status._id}
                                          value={status._id}
                                          name={status.name}
                                        >
                                          {status && t(`Keys.${status.name}`)}
                                        </option>
                                      )
                                  )}
                            </TextField>
                          </Grid>
                          <Grid item xs={12} sm={12} md={6} lg={6}>
                            <TextField
                              fullWidth
                              name="substatus"
                              select
                              onChange={e => {
                                setSubstatus(e.target.value);
                              }}
                              SelectProps={{ native: true }}
                              variant="outlined"
                            >
                              <option value={''} key={0}></option>
                              {substatuses &&
                                substatuses.map(item => {
                                  if (
                                    item.name !== 'rejected' &&
                                    item.name !== 'new' &&
                                    item.name !== 'sold' &&
                                    item.name !== 'frontdesk' &&
                                    status === item.status
                                  ) {
                                    return (
                                      <option
                                        key={item._id}
                                        value={item._id}
                                        subname={item.name}
                                      >
                                        {t(`Substatus.${item.name}`)}
                                      </option>
                                    );
                                  }
                                  return false;
                                })}
                            </TextField>
                          </Grid>
                        </Grid>
                      </Box>
                      <Typography
                        variant="h4"
                        color="textPrimary"
                        style={{ marginTop: '1em' }}
                      >
                        {comment ? '4.' : '3.'}
                        {t('Comments.Date')}
                      </Typography>
                      <Divider className={classes.divider} />
                      <Box>
                        <Grid container spacing={3} style={{ padding: 15 }}>
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            <DateTimePicker
                              fullWidth
                              inputVariant="outlined"
                              name="reschedule"
                              onClick={() => setFieldTouched('reschedule')}
                              value={date}
                              onChange={date => {
                                setDate(date);
                                handleChangeTime(date);
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                      <Typography
                        variant="h4"
                        color="textPrimary"
                        style={{ marginTop: '1em' }}
                      >
                        {comment ? '5.' : '4.'}
                        {t('Comments.Reminder')}
                      </Typography>
                      <Divider className={classes.divider} />
                      <Box>
                        <Reminder
                          label={false}
                          isActive={reminder}
                          setActive={setReminder}
                          startDate={date}
                          setReminderDate={setReminderDate}
                          current={current}
                          setCurrent={setCurrent}
                        />
                      </Box>
                      {/* {
                user && user.role && (user.role === 'rockstar' || user.role === 'super admin' || user.role === 'admin') &&
                <>
                  <Divider className={classes.divider}/>
                  <Typography variant="h4" color="textPrimary">
                    5. {t("Comments.Agent")}
                  </Typography>
                  <Box p={2}>
                    <TextField
                      fullWidth
                      name='agent'
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      >
                        <option key={0} value={''}></option>
                        {
                          agents && agents.map(agent => <option key={agent._id} value={agent._id}>{CapitalizeNames(agent.name)}</option>)
                        }
                      </TextField>
                  </Box>
                </>
              } */}
                    </Box>

                    {errors.submit && (
                      <Box mt={3}>
                        <FormHelperText error>{errors.submit}</FormHelperText>
                      </Box>
                    )}
                  </CardContent>

                  <Divider />
                  <Box p={2} display="flex" justifyContent="flex-end">
                    {comment && user && user.role === 'rockstar' && (
                      <>
                        <Button
                          onClick={() => {
                            handleDoneTask(comment._id);
                            setOpen(false);
                            setValue('');
                          }}
                          variant="contained"
                          color="secondary"
                          className={classes.btnDone}
                          startIcon={
                            <SvgIcon fontSize="small">
                              <DocumentationIcon />
                            </SvgIcon>
                          }
                        >
                          {t('Buttons.Done')}
                        </Button>

                        <Box flexGrow={1} />
                      </>
                    )}

                    {/* <Button
                  color="primary"
                  disabled={isSubmitting}
                  className={classes.btnSale}
                  variant="contained"
                  onClick={()=>handleOpenModal('sale')}
                >
                  {t("Buttons.Sale")}
                </Button> */}
                    {enableReject && (
                      <Button
                        color="primary"
                        disabled={isSubmitting}
                        className={classes.btnError}
                        variant="contained"
                        onClick={() => handleOpenModal('reject')}
                      >
                        {t('Buttons.Reject')}
                      </Button>
                    )}

                    <Button
                      color="secondary"
                      disabled={isSubmitting}
                      type="submit"
                      variant="contained"
                    >
                      {t('Titles.CreateTask')}
                    </Button>
                  </Box>
                </Card>
              </form>
            )}
          </Formik>
        </Modal>
      </div>
    );
  }
}
