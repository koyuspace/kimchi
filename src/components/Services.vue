<template>
    <div>
        <div class="widget">
            <h1>Services</h1>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Status</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>kimchi-frontend</td>
                        <td>Running</td>
                        <td><button class="btn btn-danger" disabled><i class="fa fa-stop" aria-hidden="true"></i></button> <button class="btn btn-warning" disabled><i class="fa fa-refresh" aria-hidden="true"></i></button> <button class="btn btn-primary" disabled><i class="fa fa-terminal" aria-hidden="true"></i></button></td>
                    </tr>
                    <tr>
                        <td>kimchi-backend</td>
                        <td>Running</td>
                        <td><button class="btn btn-danger" disabled><i class="fa fa-stop" aria-hidden="true"></i></button> <button class="btn btn-warning" disabled><i class="fa fa-refresh" aria-hidden="true"></i></button> <button class="btn btn-primary" disabled><i class="fa fa-terminal" aria-hidden="true"></i></button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style>
@import url(https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css);
</style>

<style scoped>
div {
    margin: 20px;
}
h1 {
    font-weight: 800;
    text-align: center;
    margin-bottom: 40px;
}
.widget {
    display: block;
    margin: 0 auto;
    background: #eee;
    padding: 40px;
    padding-bottom: 20px;
    border-radius: 4px;
    border: 1px solid #ccc;
    width: 80%;
}
button i {
    color: #fff;
}
</style>