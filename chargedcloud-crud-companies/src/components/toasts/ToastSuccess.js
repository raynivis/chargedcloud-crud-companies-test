function ToastSuccess({ id, mensagem }) {
    return (
            <div class="toast-container top-0 end-0 p-3">
                <div id={id} class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            {mensagem}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
    );
}

export default ToastSuccess;