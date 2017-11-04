import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.styl';
import TableRow from './TableRow';

const ROW_HEIGHT = 37;

class TableBody extends PureComponent {
    static propTypes = {
        columns: PropTypes.array,
        currentHoverKey: PropTypes.any,
        expandedRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        emptyText: PropTypes.func,
        onMouseOver: PropTypes.func,
        onTouchStart: PropTypes.func,
        onScroll: PropTypes.func,
        onRowHover: PropTypes.func,
        onRowClick: PropTypes.func,
        records: PropTypes.array,
        rowClassName: PropTypes.func,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        scrollTop: PropTypes.number
    };

    static defaultProps = {
        emptyText: () => {
            return 'No Data';
        },
        onMouseOver: () => {},
        onTouchStart: () => {},
        onScroll: () => {},
        records: [],
        rowKey: 'key'
    };

    constructor(props) {
        super(props);

        this.state = {
            from: 0,
            to: props.records.length
        };
    }

    componentDidMount() {
        const { onMouseOver, onTouchStart } = this.props;
        this.body.parentElement.addEventListener('scroll', this._handleScroll);
        this.body.addEventListener('mouseover', onMouseOver);
        this.body.addEventListener('touchstart', onTouchStart);

        setTimeout(() => {
            const count = Math.ceil(this.body.offsetHeight / ROW_HEIGHT) + 4;
            this.setState({ to: count });
        }, 100);
    }

    componentWillUnmount() {
        const { onMouseOver, onTouchStart } = this.props;
        this.body.parentElement.removeEventListener('scroll', this._handleScroll);
        this.body.removeEventListener('mouseover', onMouseOver);
        this.body.removeEventListener('touchstart', onTouchStart);
    }

    _handleScroll = (event) => {
        const start = Math.max(Math.floor(event.target.scrollTop / ROW_HEIGHT) - 2, 0);
        const count = Math.ceil(this.body.offsetHeight / ROW_HEIGHT) + 4;
        this.setState({ from: start, to: Math.min(start + count, this.props.records.length) });
        this.props.onScroll(event);
    }

    componentDidUpdate(prevProps, prevState) {
    }

    getRowKey (record, index) {
        const rowKey = this.props.rowKey;
        let key = (typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey]);
        return key === undefined ? `table_row_${index}` : key;
    }

    render() {
        const {
            columns,
            currentHoverKey,
            expandedRowKeys,
            expandedRowRender,
            emptyText,
            onRowHover,
            onRowClick,
            records,
            rowClassName
        } = this.props;
        const noData = (!records || records.length === 0);

        const rows = [
            <div key="placeholder" style={{ height: 37 * this.state.from }} />
        ];

        for (let i = this.state.from; i < this.state.to; i++) {
            let row = records[i];
            let key = this.getRowKey(row, i);

            rows.push(
                <TableRow
                    columns={columns}
                    currentHoverKey={currentHoverKey}
                    expandedRowKeys={expandedRowKeys}
                    expandedRowRender={expandedRowRender}
                    hoverKey={key}
                    index={i}
                    key={key}
                    onHover={onRowHover}
                    onRowClick={onRowClick}
                    record={row}
                    rowClassName={rowClassName}
                />
            );
        }
        rows.push(
            <div key="placeholder2" style={{ height: 37 * (records.length - this.state.to) }} />
        );

        return (
            <div
                className={styles.tbody}
                ref={node => {
                    this.body = node;
                }}
            >
                {
                    rows
                }
                {
                    noData &&
                    <div className={styles.tablePlaceholder}>
                        { emptyText() }
                    </div>
                }
            </div>
        );
    }
}

export default TableBody;
