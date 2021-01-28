import React, { Component } from "react";
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextField from '@material-ui/core/TextField';

class Password extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPassword: false
    };
  }
  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  render() {
      return (
        <TextField
            error={Boolean(this.props.touched.password && this.props.errors.password)}
            helperText={this.props.touched.password && this.props.errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={this.props.handleBlur}
            onChange={this.props.handleChange}
            type={this.state.showPassword ? "text" : "password"}
            value={this.props.values.password}
            variant="outlined"
            className={this.props.fullWidth ? '' : "halfWidth"}
            fullWidth={this.props.fullWidth}
            InputProps={{
            endAdornment:
                <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={this.handleClickShowPassword}
                    onMouseDown={this.handleMouseDownPassword}
                >
                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
                </InputAdornment>
            }}
        />
      );
  }
}
export default Password;
