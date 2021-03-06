import React from "react"
import clsx from "clsx"
import PropTypes from "prop-types"
import { lighten, makeStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TablePagination from "@material-ui/core/TablePagination"
import TableRow from "@material-ui/core/TableRow"
import TableSortLabel from "@material-ui/core/TableSortLabel"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import { Icon, Menu, MenuItem, TextField } from "@material-ui/core"
import moment from "moment"
import "./ScrapeForm.scss"

// function createData(name, date, count, selector, result) {
//     return { name, date, count, selector, result }
// }

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0])
        if (order !== 0) return order
        return a[1] - b[1]
    })
    return stabilizedThis.map(el => el[0])
}

function getSorting(order, orderBy) {
    return order === "desc" ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}

const headRows = [
    { id: "name", alignRight: false, disablePadding: true, label: "Name" },
    { id: "selector", alignRight: true, disablePadding: false, label: "Selector" },
    { id: "date", alignRight: true, disablePadding: false, label: "Date" },
    { id: "count", alignRight: true, disablePadding: false, label: "Scrape Count" },
    { id: "result", alignRight: true, disablePadding: false, label: "Last Result" }
]

function EnhancedTableHead(props) {
    // eslint-disable-next-line
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
    const createSortHandler = property => event => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    {/*<Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ "aria-label": "Select all desserts" }}
                    />*/}
                </TableCell>
                {headRows.map((row, index) => (
                    <TableCell
                        key={row.id}
                        align={row.alignRight ? "right" : "left"}
                        padding={row.disablePadding && index === 0 && !props.dense ? "none" : "default"}
                        sortDirection={orderBy === row.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === row.id}
                            direction={order}
                            onClick={createSortHandler(row.id)}
                        >
                            {row.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
}

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1)
    },
    highlight:
        theme.palette.type === "light"
            ? {
                  color: theme.palette.secondary.main,
                  backgroundColor: lighten(theme.palette.secondary.light, 0.85)
              }
            : {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.secondary.dark
              },
    spacer: {
        flex: "1 1 100%"
    },
    actions: {
        color: theme.palette.text.secondary
    },
    title: {
        flex: "0 0 auto"
    }
}))

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles()
    const { numSelected } = props

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle">
                        Scrape
                    </Typography>
                )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="Delete">
                            <Icon>delete</Icon>
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton aria-label="Filter list">
                            <Icon>filter_list</Icon>
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </Toolbar>
    )
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
}

const useStyles = makeStyles(theme => ({
    root: {
        width: "90%",
        marginTop: theme.spacing(3)
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: 750,
        tableLayout: "fixed"
    },
    tableWrapper: {
        overflowX: "auto"
    }
}))

export default function EnhancedTable(props) {
    const classes = useStyles()
    const [order, setOrder] = React.useState("asc")
    const [orderBy, setOrderBy] = React.useState("date")
    const [selected, setSelected] = React.useState([])
    const [page, setPage] = React.useState(0)
    const [dense, setDense] = React.useState(false)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [currentId, setCurrentId] = React.useState(null)
    const [name, setName] = React.useState("")
    const [editName, setEditName] = React.useState(false)
    const [selector, setSelector] = React.useState("")
    const [editSelector, setEditSelector] = React.useState(false)

    const rows = props.items

    function editItem(event, id) {
        setEditName(false)
        setEditSelector(false)
        setAnchorEl(event.currentTarget)
        setCurrentId(id)
    }

    function handleClose() {
        setAnchorEl(null)
    }

    function handleRequestSort(event, property) {
        const isDesc = orderBy === property && order === "desc"
        setOrder(isDesc ? "asc" : "desc")
        setOrderBy(property)
    }

    function handleSelectAllClick(event) {
        if (event.target.checked) {
            const newSelecteds = rows.map(n => n.name)
            setSelected(newSelecteds)
            return
        }
        setSelected([])
    }

    // eslint-disable-next-line
    function handleClick(event, name) {
        const selectedIndex = selected.indexOf(name)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
        }

        setSelected(newSelected)
    }

    function handleChangePage(event, newPage) {
        setPage(newPage)
    }

    function handleChangeRowsPerPage(event) {
        setRowsPerPage(+event.target.value)
    }

    function handleChangeDense(event) {
        setDense(event.target.checked)
    }

    function clickEditName() {
        setEditName(true)
        setName(rows.find(row => row._id === currentId).name)
        handleClose()
    }

    function clickEditSelector() {
        setEditSelector(true)
        setSelector(rows.find(row => row._id === currentId).selector)
        handleClose()
    }

    function clickDelete() {
        props.deleteItem(currentId)
        handleClose()
    }

    const isSelected = name => selected.indexOf(name) !== -1

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle" size={dense ? "small" : "medium"}>
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            dense={dense}
                        />
                        <TableBody>
                            {stableSort(rows, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.name)
                                    const labelId = `enhanced-table-checkbox-${index}`

                                    return (
                                        <TableRow
                                            hover
                                            // onClick={event => editItem(event, row._id)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.date}
                                            selected={isItemSelected}
                                        >
                                            <Menu
                                                id="simple-menu"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={Boolean(anchorEl)}
                                                onClose={handleClose}
                                            >
                                                <MenuItem disabled={true}>
                                                    {rows.find(row => row._id === currentId) &&
                                                        rows.find(row => row._id === currentId).name}
                                                </MenuItem>
                                                <MenuItem onClick={clickEditName}>Edit name</MenuItem>
                                                <MenuItem onClick={clickEditSelector}>Edit selector</MenuItem>
                                                <MenuItem onClick={clickDelete}>Delete</MenuItem>
                                            </Menu>
                                            <TableCell padding="checkbox">
                                                {/*<Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{ "aria-labelledby": labelId }}
                                                />*/}
                                                <Tooltip title="Edit item">
                                                    <IconButton
                                                        aria-label="edit item"
                                                        onClick={event => editItem(event, row._id)}
                                                    >
                                                        <Icon>edit</Icon>
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding={!dense ? "none" : "default"}
                                            >
                                                {editName && currentId === row._id ? (
                                                    <>
                                                        <TextField
                                                            id="edit-name"
                                                            placeholder="Edit name"
                                                            type="text"
                                                            value={name}
                                                            onChange={e => setName(e.target.value)}
                                                        />
                                                        <IconButton>
                                                            <Icon>check</Icon>
                                                        </IconButton>
                                                    </>
                                                ) : (
                                                    row.name
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {editSelector && currentId === row._id ? (
                                                    <>
                                                        <TextField
                                                            id="edit-selector"
                                                            placeholder="Edit selector"
                                                            type="text"
                                                            value={selector}
                                                            onChange={e => setSelector(e.target.value)}
                                                        />
                                                        <IconButton>
                                                            <Icon>check</Icon>
                                                        </IconButton>
                                                    </>
                                                ) : (
                                                    row.selector
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {moment(row.date).format("D MMMM YYYY, hh:mm")}
                                            </TableCell>
                                            <TableCell align="right">{row.count}</TableCell>
                                            <TableCell align="right">{row.result}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        "aria-label": "Previous Page"
                    }}
                    nextIconButtonProps={{
                        "aria-label": "Next Page"
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense display" />
        </div>
    )
}
