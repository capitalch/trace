import styles from './comp1-child.module.scss'
function Comp1Child() {
    return (
        <div className={styles.container}>
            <div>Left</div>
            <div>Right</div>
        </div>
    )
}

export { Comp1Child }