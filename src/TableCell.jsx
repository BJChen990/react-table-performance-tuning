import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import styles from './index.styl';

class TableCell extends Component {
    static propTypes = {
        column: PropTypes.object,
        record: PropTypes.object
    };

    static defaultProps = {
        column: {},
        record: {}
    };

    shouldComponentUpdate(nextProps, nextState) {
        const { column: currentColumn, record: currentRecord } = this.props;
        const { column: nextColumn, record: nextRecord } = nextProps;
        const currentDataKey = (typeof currentColumn.dataKey !== 'undefined') ? currentColumn.dataKey : currentColumn.dataIndex;
        const nextDataKey = (typeof nextColumn.dataKey !== 'undefined') ? nextColumn.dataKey : nextColumn.dataIndex;

        return (
            (typeof nextProps.column.render === 'function')
            ||
            nextProps.column !== this.props.column
            ||
            (
                nextProps.record !== this.props.record &&
                get(currentRecord, currentDataKey) !== get(nextRecord, nextDataKey)
            )
        );
    }

    render() {
        const { column, record } = this.props;
        const render = column.render;
        // dataKey is an alias for dataIndex
        const dataKey = (typeof column.dataKey !== 'undefined') ? column.dataKey : column.dataIndex;
        const text = get(record, dataKey);

        return (
            <div
                className={classNames(
                    styles.td,
                    column.className,
                    column.cellClassName
                )}
                style={{
                    ...column.style,
                    ...column.cellStyle
                }}
            >
                <div className={styles.tdContent}>
                    {typeof render === 'function' ? render(text, record) : text}
                </div>
            </div>
        );
    }
}

export default TableCell;
